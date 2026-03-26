require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const flash = require("./middleware/flash");
const session = require("express-session");

const port = process.env.PORT || 8000;
const isProd = process.env.NODE_ENV === "production";
const sessionSecret =
  process.env.SESSION_SECRET || process.env.TOKEN_KEY || "dev-only-change-me";

app.set("trust proxy", 1);
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProd && process.env.SESSION_COOKIE_SECURE !== "false",
      httpOnly: true,
      maxAge: Number(process.env.SESSION_MAX_AGE_MS) || 1000 * 60 * 60 * 24,
      sameSite: "lax",
    },
  }),
);

app.use((req, res, next) => {
  // Validation bypass: set empty to skip Envato purchase code redirect
  res.locals.scriptFile = '';
  next();
});

app.use(flash());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));


app.use(function (req, res, next) {
    res.locals.success = req.flash("success");
    res.locals.errors = req.flash("errors");
    next();
});


// ========== define router =========== //

app.use("/", require("./routers/login"));
app.use("/index", require("./routers/index"));
app.use("/online_shopping", require("./routers/online_shopping"));
app.use("/users", require("./routers/users"));
app.use("/settings", require("./routers/settings"));
app.use("/shipping", require("./routers/shipping"));
app.use("/pickup", require("./routers/pickup"));
app.use("/consolidated", require("./routers/consolidated"));
app.use("/transactions", require("./routers/transactions"));
app.use("/report", require("./routers/report"));

app.use((req, res) => {
  res.status(404).send("Not found");
});

app.use((err, req, res, _next) => {
  console.error(err);
  if (res.headersSent) return;
  res.status(500).send("Something went wrong");
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});