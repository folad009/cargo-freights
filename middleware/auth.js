const jwt = require("jsonwebtoken");
const language = require("../public/language/languages.json");

const LANG_MAP = {
  en: () => language.en,
  de: () => language.de,
  es: () => language.es,
  fr: () => language.fr,
  pt: () => language.pt,
  cn: () => language.cn,
  ae: () => language.ae,
  in: () => language.in,
};

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      req.flash("errors", "You Are Not Authorized, Please Login First ...");
      return res.redirect("/");
    }

    const decode = await jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decode;

    const lang = req.cookies.lang;
    let decode_lang;

    if (!lang) {
      decode_lang = { lang: "en" };
    } else {
      decode_lang = await jwt.verify(lang, process.env.TOKEN);
    }
    req.lang = decode_lang;

    const langKey = decode_lang.lang || "en";
    const pickLang = LANG_MAP[langKey] || LANG_MAP.en;
    req.language_data = pickLang();

    next();
  } catch (error) {
    console.error(error);
    req.flash("errors", "You Are Not Authorized, Please Login First ...");
    return res.redirect("/");
  }
};

module.exports = auth;
