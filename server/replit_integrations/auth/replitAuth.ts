import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import bcrypt from "bcryptjs";
import { authStorage } from "./storage";
import { z } from "zod";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" || !!process.env.REPL_SLUG,
      maxAge: sessionTtl,
      sameSite: "lax" as const,
    },
  });
}

const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A palavra-passe deve ter pelo menos 6 caracteres"),
  firstName: z.string().min(1, "Nome é obrigatório"),
  lastName: z.string().optional(),
  username: z.string().min(3, "O nome de utilizador deve ter pelo menos 3 caracteres").optional(),
});

const loginSchema = z.object({
  identifier: z.string().min(1, "Email ou nome de utilizador é obrigatório"),
  password: z.string().min(1, "Palavra-passe é obrigatória"),
});

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await authStorage.getUser(id);
      if (user) {
        done(null, { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, profileImageUrl: user.profileImageUrl });
      } else {
        done(null, false);
      }
    } catch (err) {
      done(err);
    }
  });

  passport.use(
    new LocalStrategy(
      { usernameField: "identifier", passwordField: "password" },
      async (identifier, password, done) => {
        try {
          const user = await authStorage.getUserByEmailOrUsername(identifier);
          if (!user) {
            return done(null, false, { message: "Utilizador não encontrado" });
          }
          if (!user.passwordHash) {
            return done(null, false, { message: "Esta conta utiliza login social. Use o botão correspondente." });
          }
          const isValid = await bcrypt.compare(password, user.passwordHash);
          if (!isValid) {
            return done(null, false, { message: "Palavra-passe incorreta" });
          }
          return done(null, { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, profileImageUrl: user.profileImageUrl });
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "/api/auth/google/callback",
          scope: ["profile", "email"],
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value;
            let user = await authStorage.getUserByProviderId("google", profile.id);
            if (!user && email) {
              user = await authStorage.getUserByEmail(email);
              if (user) {
                await authStorage.upsertUser({
                  ...user,
                  provider: "google",
                  providerId: profile.id,
                  profileImageUrl: profile.photos?.[0]?.value || user.profileImageUrl,
                  isEmailVerified: true,
                });
                user = await authStorage.getUser(user.id);
              }
            }
            if (!user) {
              user = await authStorage.createUser({
                email: email || undefined,
                firstName: profile.name?.givenName || profile.displayName,
                lastName: profile.name?.familyName || undefined,
                profileImageUrl: profile.photos?.[0]?.value || undefined,
                provider: "google",
                providerId: profile.id,
                isEmailVerified: true,
              });
            }
            return done(null, { id: user!.id, email: user!.email, firstName: user!.firstName, lastName: user!.lastName, profileImageUrl: user!.profileImageUrl });
          } catch (err) {
            return done(err as Error);
          }
        }
      )
    );
  }

  app.post("/api/auth/register", async (req, res) => {
    try {
      const input = registerSchema.parse(req.body);

      const existingByEmail = await authStorage.getUserByEmail(input.email);
      if (existingByEmail) {
        return res.status(400).json({ message: "Este email já está registado" });
      }

      if (input.username) {
        const existingByUsername = await authStorage.getUserByUsername(input.username);
        if (existingByUsername) {
          return res.status(400).json({ message: "Este nome de utilizador já está em uso" });
        }
      }

      const passwordHash = await bcrypt.hash(input.password, 12);

      const user = await authStorage.createUser({
        email: input.email,
        username: input.username || undefined,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName || undefined,
        provider: "local",
        isEmailVerified: false,
      });

      req.login({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, profileImageUrl: user.profileImageUrl }, (err) => {
        if (err) {
          return res.status(500).json({ message: "Erro ao iniciar sessão" });
        }
        return res.status(201).json({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName });
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Registration error:", err);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/auth/login", (req, res, next) => {
    try {
      loginSchema.parse(req.body);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
    }

    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: "Erro interno do servidor" });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Credenciais inválidas" });
      }
      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ message: "Erro ao iniciar sessão" });
        }
        return res.json(user);
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao terminar sessão" });
      }
      req.session.destroy((destroyErr) => {
        if (destroyErr) {
          console.error("Session destroy error:", destroyErr);
        }
        res.clearCookie("connect.sid");
        return res.json({ message: "Sessão terminada" });
      });
    });
  });

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
    app.get(
      "/api/auth/google/callback",
      passport.authenticate("google", { failureRedirect: "/?auth_error=google_failed" }),
      (_req, res) => {
        res.redirect("/");
      }
    );
  }

  app.get("/api/auth/providers", (_req, res) => {
    res.json({
      google: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      apple: false,
      facebook: false,
    });
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated() && req.user) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};
