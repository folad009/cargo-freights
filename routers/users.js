const express = require("express");
const { mySqlQury } = require("../middleware/db");
const router = express.Router();
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const access = require("../middleware/access");
const countryCodes = require("country-codes-list");

/** Recent notifications for header (parameterized). */
function notificationsFor(userId) {
  return mySqlQury(
    "SELECT * FROM tbl_notification WHERE received = ? ORDER BY id DESC LIMIT 3",
    [userId],
  );
}

function hasRows(r) {
  return Array.isArray(r) && r.length > 0;
}

// ========= customers ============= //

router.get("/customers", auth, async (req, res) => {
  try {
    const role_data = req.user;
    const lang_data = req.language_data;
    const language_name = req.lang;
    const accessdata = await access(req.user);
    const notification_data = await notificationsFor(role_data.id);
    const register_packages_notification = await mySqlQury(
      `SELECT * FROM tbl_register_packages`,
    );
    const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`);
    const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`);
    const consolidated_notification = await mySqlQury(
      `SELECT * FROM tbl_consolidated`,
    );

    const customers_data = await mySqlQury(
      `SELECT * FROM tbl_customers ORDER BY id DESC`,
    );

    res.render("customers", {
      role_data: role_data,
      accessdata,
      lang_data,
      language_name,
      notification_data,
      register_packages_notification,
      shipment_notification,
      pickup_notification,
      consolidated_notification,
      customers_data: customers_data,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/add_customers", auth, async (req, res) => {
  try {
    const role_data = req.user;
    const lang_data = req.language_data;
    const language_name = req.lang;
    const accessdata = await access(req.user);
    const notification_data = await notificationsFor(role_data.id);
    const register_packages_notification = await mySqlQury(
      `SELECT * FROM tbl_register_packages`,
    );
    const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`);
    const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`);
    const consolidated_notification = await mySqlQury(
      `SELECT * FROM tbl_consolidated`,
    );

    const countries_data = await mySqlQury(`SELECT * FROM tbl_countries `);

    const Country_name = countryCodes.customList("countryCode", "{countryCode}");
    const nameCode = Object.values(Country_name);

    const myCountryCodesObject = countryCodes.customList(
      "countryCode",
      "+{countryCallingCode}",
    );
    const CountryCode = Object.values(myCountryCodesObject);

    res.render("add_customers", {
      role_data: role_data,
      accessdata,
      lang_data,
      language_name,
      notification_data,
      register_packages_notification,
      shipment_notification,
      pickup_notification,
      consolidated_notification,
      countries_data: countries_data,
      nameCode,
      CountryCode,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/customers/ajax", auth, async (req, res) => {
  try {
    const countries_data = await mySqlQury(`SELECT * FROM tbl_countries `);
    res.status(200).json({ countries_data });
  } catch (error) {
    console.log(error);
  }
});

router.post("/add_customers", auth, async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      country_code,
      mobile,
      country,
      state,
      city,
      zipcode,
      address,
      customer_active,
    } = req.body;

    const sing_up_data = await mySqlQury(
      "SELECT * FROM tbl_admin WHERE email = ? LIMIT 1",
      [email],
    );
    if (hasRows(sing_up_data)) {
      req.flash("errors", `This Email Alredy Register!!!!`);
      return res.redirect("back");
    }

    const admin = await mySqlQury(`SELECT * FROM tbl_admin ORDER BY id DESC LIMIT 1`);
    const login_id = admin[0].id + 1;

    await mySqlQury(
      `INSERT INTO tbl_customers (first_name, last_name, email, country_code, mobile, customers_country, customers_state, customers_city, customers_zipcode, customers_address, customer_active, login_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        first_name,
        last_name,
        email,
        country_code,
        mobile,
        country,
        state,
        city,
        zipcode,
        address,
        customer_active,
        login_id,
      ],
    );

    const hash = await bcrypt.hash(password, 10);

    await mySqlQury(
      `INSERT INTO tbl_admin (first_name, last_name, email, country_code, phone_no, password, role) VALUES (?, ?, ?, ?, ?, ?, 2)`,
      [first_name, last_name, email, country_code, mobile, hash],
    );

    req.flash("success", `Added successfully`);
    res.redirect("/users/customers");
  } catch (error) {
    console.log(error);
  }
});

router.get("/edit_customers/:id", auth, async (req, res) => {
  try {
    const role_data = req.user;
    const lang_data = req.language_data;
    const language_name = req.lang;
    const accessdata = await access(req.user);
    const notification_data = await notificationsFor(role_data.id);
    const register_packages_notification = await mySqlQury(
      `SELECT * FROM tbl_register_packages`,
    );
    const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`);
    const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`);
    const consolidated_notification = await mySqlQury(
      `SELECT * FROM tbl_consolidated`,
    );

    const idParam = req.params.id;

    if (role_data.role == "2") {
      let edit_customers_data = await mySqlQury(
        "SELECT * FROM tbl_customers WHERE login_id = ? LIMIT 1",
        [idParam],
      );

      const cuuntry = edit_customers_data[0].customers_country.split(",");
      const state = edit_customers_data[0].customers_state.split(",");
      const city = edit_customers_data[0].customers_city.split(",");
      const zipcode = edit_customers_data[0].customers_zipcode.split(",");
      const address = edit_customers_data[0].customers_address.split(",");

      const countries_data = await mySqlQury(`SELECT * FROM tbl_countries `);
      const state_data = await mySqlQury(`SELECT * FROM tbl_states`);
      const city_data = await mySqlQury(`SELECT * FROM tbl_city`);

      const Country_name = countryCodes.customList("countryCode", "{countryCode}");
      const nameCode = Object.values(Country_name);

      const myCountryCodesObject = countryCodes.customList(
        "countryCode",
        "+{countryCallingCode}",
      );
      const CountryCode = Object.values(myCountryCodesObject);

      res.render("edit_customers", {
        role_data: role_data,
        accessdata,
        lang_data,
        language_name,
        notification_data,
        register_packages_notification,
        shipment_notification,
        pickup_notification,
        consolidated_notification,
        edit_customers_data: edit_customers_data,
        cuuntry: cuuntry,
        state: state,
        city: city,
        zipcode: zipcode,
        address: address,
        countries_data: countries_data,
        state_data: state_data,
        city_data: city_data,
        nameCode,
        CountryCode,
      });
    } else {
      let edit_customers_data = await mySqlQury(
        "SELECT * FROM tbl_customers WHERE id = ? LIMIT 1",
        [idParam],
      );

      const cuuntry = edit_customers_data[0].customers_country.split(",");
      const state = edit_customers_data[0].customers_state.split(",");
      const city = edit_customers_data[0].customers_city.split(",");
      const zipcode = edit_customers_data[0].customers_zipcode.split(",");
      const address = edit_customers_data[0].customers_address.split(",");

      const countries_data = await mySqlQury(`SELECT * FROM tbl_countries `);
      const state_data = await mySqlQury(`SELECT * FROM tbl_states`);
      const city_data = await mySqlQury(`SELECT * FROM tbl_city`);

      const Country_name = countryCodes.customList("countryCode", "{countryCode}");
      const nameCode = Object.values(Country_name);

      const myCountryCodesObject = countryCodes.customList(
        "countryCode",
        "+{countryCallingCode}",
      );
      const CountryCode = Object.values(myCountryCodesObject);

      res.render("edit_customers", {
        role_data: role_data,
        accessdata,
        lang_data,
        language_name,
        notification_data,
        register_packages_notification,
        shipment_notification,
        pickup_notification,
        consolidated_notification,
        edit_customers_data: edit_customers_data,
        cuuntry: cuuntry,
        state: state,
        city: city,
        zipcode: zipcode,
        address: address,
        countries_data: countries_data,
        state_data: state_data,
        city_data: city_data,
        nameCode,
        CountryCode,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/edit_customers/:id", auth, async (req, res) => {
  try {
    const role_data = req.user;
    const idParam = req.params.id;

    let old_data = await mySqlQury(
      "SELECT * FROM tbl_customers WHERE id = ? LIMIT 1",
      [idParam],
    );

    const {
      first_name,
      last_name,
      email,
      country_code,
      mobile,
      country,
      state,
      city,
      zipcode,
      address,
      customer_active,
    } = req.body;

    await mySqlQury(
      `UPDATE tbl_customers SET first_name = ?, last_name = ?, email = ?, country_code = ?, mobile = ?, customers_country = ?, customers_state = ?, customers_city = ?, customers_zipcode = ?, customers_address = ?, customer_active = ? WHERE id = ?`,
      [
        first_name,
        last_name,
        email,
        country_code,
        mobile,
        country,
        state,
        city,
        zipcode,
        address,
        customer_active,
        idParam,
      ],
    );

    await mySqlQury(
      `UPDATE tbl_admin SET first_name = ?, last_name = ?, email = ?, country_code = ?, phone_no = ? WHERE email = ?`,
      [
        first_name,
        last_name,
        email,
        country_code,
        mobile,
        old_data[0].email,
      ],
    );

    req.flash("success", `Added successfully`);

    if (role_data.role == "2") {
      res.redirect("back");
    } else {
      res.redirect("/users/customers");
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/customers/delete/:id", auth, async (req, res) => {
  try {
    const idParam = req.params.id;

    let old_data = await mySqlQury(
      "SELECT * FROM tbl_customers WHERE id = ? LIMIT 1",
      [idParam],
    );

    await mySqlQury("DELETE FROM tbl_customers WHERE id = ?", [idParam]);

    await mySqlQury("DELETE FROM tbl_admin WHERE email = ?", [old_data[0].email]);

    req.flash("success", `Deleted successfully`);
    res.redirect("/users/customers");
  } catch (error) {
    console.log(error);
  }
});

// ========= client ============= //

router.get("/client", auth, async (req, res) => {
  try {
    const role_data = req.user;
    const lang_data = req.language_data;
    const language_name = req.lang;
    const accessdata = await access(req.user);
    const notification_data = await notificationsFor(role_data.id);
    const register_packages_notification = await mySqlQury(
      `SELECT * FROM tbl_register_packages`,
    );
    const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`);
    const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`);
    const consolidated_notification = await mySqlQury(
      `SELECT * FROM tbl_consolidated`,
    );

    if (role_data.id == "1") {
      let client_data = await mySqlQury(`SELECT * FROM tbl_client ORDER BY id DESC`);

      res.render("client", {
        role_data: role_data,
        accessdata,
        lang_data,
        language_name,
        notification_data,
        register_packages_notification,
        shipment_notification,
        pickup_notification,
        consolidated_notification,
        client_data: client_data,
      });
    } else {
      const customer_data = await mySqlQury(
        "SELECT * FROM tbl_customers WHERE login_id = ? LIMIT 1",
        [role_data.id],
      );

      let client_data = await mySqlQury(
        "SELECT * FROM tbl_client WHERE customer = ? ORDER BY id DESC",
        [customer_data[0].id],
      );

      res.render("client", {
        role_data: role_data,
        accessdata,
        lang_data,
        language_name,
        notification_data,
        register_packages_notification,
        shipment_notification,
        pickup_notification,
        consolidated_notification,
        client_data: client_data,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/add_client", auth, async (req, res) => {
  try {
    const role_data = req.user;
    const lang_data = req.language_data;
    const language_name = req.lang;
    const accessdata = await access(req.user);
    const notification_data = await notificationsFor(role_data.id);
    const register_packages_notification = await mySqlQury(
      `SELECT * FROM tbl_register_packages`,
    );
    const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`);
    const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`);
    const consolidated_notification = await mySqlQury(
      `SELECT * FROM tbl_consolidated`,
    );

    const countries_data = await mySqlQury(`SELECT * FROM tbl_countries `);

    const customer_data = await mySqlQury(
      `SELECT * FROM tbl_customers WHERE customer_active = 1`,
    );

    res.render("add_client", {
      role_data: role_data,
      accessdata,
      lang_data,
      language_name,
      notification_data,
      register_packages_notification,
      shipment_notification,
      pickup_notification,
      consolidated_notification,
      countries_data: countries_data,
      customer_data: customer_data,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/add_client", auth, async (req, res) => {
  try {
    const {
      customer,
      first_name,
      last_name,
      email,
      mobile,
      country,
      state,
      city,
      zipcode,
      address,
    } = req.body;

    const customer_data = await mySqlQury(
      "SELECT * FROM tbl_customers WHERE login_id = ? LIMIT 1",
      [customer],
    );

    await mySqlQury(
      `INSERT INTO tbl_client (customer, first_name, last_name, email, mobile, country, state, city, zipcode, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer_data[0].id,
        first_name,
        last_name,
        email,
        mobile,
        country,
        state,
        city,
        zipcode,
        address,
      ],
    );

    req.flash("success", `Added successfully`);
    res.redirect("/users/client");
  } catch (error) {
    console.log(error);
  }
});

router.get("/edit_client/:id", auth, async (req, res) => {
  try {
    const role_data = req.user;
    const lang_data = req.language_data;
    const language_name = req.lang;
    const accessdata = await access(req.user);
    const notification_data = await notificationsFor(role_data.id);
    const register_packages_notification = await mySqlQury(
      `SELECT * FROM tbl_register_packages`,
    );
    const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`);
    const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`);
    const consolidated_notification = await mySqlQury(
      `SELECT * FROM tbl_consolidated`,
    );

    const client_data = await mySqlQury(
      "SELECT * FROM tbl_client WHERE id = ? LIMIT 1",
      [req.params.id],
    );

    const customer_data = await mySqlQury(
      `SELECT * FROM tbl_customers WHERE customer_active = 1`,
    );

    const cuuntry = client_data[0].country.split(",");
    const state = client_data[0].state.split(",");
    const city = client_data[0].city.split(",");
    const zipcode = client_data[0].zipcode.split(",");
    const address = client_data[0].address.split(",");

    const countries_data = await mySqlQury(`SELECT * FROM tbl_countries `);
    const state_data = await mySqlQury(`SELECT * FROM tbl_states`);
    const city_data = await mySqlQury(`SELECT * FROM tbl_city`);

    res.render("edit_client", {
      role_data: role_data,
      accessdata,
      lang_data,
      language_name,
      notification_data,
      register_packages_notification,
      shipment_notification,
      pickup_notification,
      consolidated_notification,
      client_data: client_data,
      customer_data: customer_data,
      countries_data: countries_data,
      state_data: state_data,
      city_data: city_data,
      cuuntry: cuuntry,
      state: state,
      city: city,
      zipcode: zipcode,
      address: address,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/edit_client/:id", auth, async (req, res) => {
  try {
    const {
      customer,
      first_name,
      last_name,
      email,
      mobile,
      cuuntry,
      state,
      city,
      zipcode,
      address,
    } = req.body;

    await mySqlQury(
      `UPDATE tbl_client SET customer = ?, first_name = ?, last_name = ?, email = ?, mobile = ?, country = ?, state = ?, city = ?, zipcode = ?, address = ? WHERE id = ?`,
      [
        customer,
        first_name,
        last_name,
        email,
        mobile,
        cuuntry,
        state,
        city,
        zipcode,
        address,
        req.params.id,
      ],
    );

    req.flash("success", `Added successfully`);
    res.redirect("/users/client");
  } catch (error) {
    console.log(error);
  }
});

router.get("/client/delete/:id", auth, async (req, res) => {
  try {
    await mySqlQury("DELETE FROM tbl_client WHERE id = ?", [req.params.id]);

    req.flash("success", `Deleted successfully`);
    res.redirect("/users/client");
  } catch (error) {
    console.log(error);
  }
});

// ========= Drivers ============= //

router.get("/drivers", auth, async (req, res) => {
  try {
    const role_data = req.user;
    const lang_data = req.language_data;
    const language_name = req.lang;
    const accessdata = await access(req.user);
    const notification_data = await notificationsFor(role_data.id);
    const register_packages_notification = await mySqlQury(
      `SELECT * FROM tbl_register_packages`,
    );
    const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`);
    const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`);
    const consolidated_notification = await mySqlQury(
      `SELECT * FROM tbl_consolidated`,
    );

    const drivers_data = await mySqlQury(`SELECT * FROM tbl_drivers ORDER BY id DESC`);

    res.render("drivers", {
      role_data: role_data,
      accessdata,
      lang_data,
      language_name,
      notification_data,
      register_packages_notification,
      shipment_notification,
      pickup_notification,
      consolidated_notification,
      drivers_data: drivers_data,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/add_drivers", auth, async (req, res) => {
  try {
    const role_data = req.user;
    const lang_data = req.language_data;
    const language_name = req.lang;
    const accessdata = await access(req.user);
    const notification_data = await notificationsFor(role_data.id);
    const register_packages_notification = await mySqlQury(
      `SELECT * FROM tbl_register_packages`,
    );
    const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`);
    const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`);
    const consolidated_notification = await mySqlQury(
      `SELECT * FROM tbl_consolidated`,
    );

    res.render("add_drivers", {
      role_data: role_data,
      accessdata,
      lang_data,
      language_name,
      notification_data,
      register_packages_notification,
      shipment_notification,
      pickup_notification,
      consolidated_notification,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/add_drivers", auth, async (req, res) => {
  try {
    const { first_name, last_name, email, password, mobile, vehicle_plate, active } =
      req.body;

    const sing_up_data = await mySqlQury(
      "SELECT * FROM tbl_admin WHERE email = ? LIMIT 1",
      [email],
    );
    if (hasRows(sing_up_data)) {
      req.flash("errors", `This Email Alredy Register!!!!`);
      return res.redirect("back");
    }

    const admin = await mySqlQury(`SELECT * FROM tbl_admin ORDER BY id DESC LIMIT 1`);
    const login_id = admin[0].id + 1;

    await mySqlQury(
      `INSERT INTO tbl_drivers (first_name, last_name, email, mobile, vehicle_plate, active, login_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, mobile, vehicle_plate, active, login_id],
    );

    const hash = await bcrypt.hash(password, 10);

    await mySqlQury(
      `INSERT INTO tbl_admin (first_name, last_name, email, phone_no, password, role) VALUES (?, ?, ?, ?, ?, 3)`,
      [first_name, last_name, email, mobile, hash],
    );

    req.flash("success", `Added successfully`);
    res.redirect("/users/drivers");
  } catch (error) {
    console.log(error);
  }
});

router.get("/edit_drivers/:id", auth, async (req, res) => {
  try {
    const role_data = req.user;
    const lang_data = req.language_data;
    const language_name = req.lang;
    const accessdata = await access(req.user);
    const notification_data = await notificationsFor(role_data.id);
    const register_packages_notification = await mySqlQury(
      `SELECT * FROM tbl_register_packages`,
    );
    const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`);
    const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`);
    const consolidated_notification = await mySqlQury(
      `SELECT * FROM tbl_consolidated`,
    );

    const edit_drivers_data = await mySqlQury(
      "SELECT * FROM tbl_drivers WHERE id = ? LIMIT 1",
      [req.params.id],
    );

    res.render("edit_drivers", {
      role_data: role_data,
      accessdata,
      lang_data,
      language_name,
      notification_data,
      register_packages_notification,
      shipment_notification,
      pickup_notification,
      consolidated_notification,
      edit_drivers_data: edit_drivers_data[0],
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/edit_drivers/:id", auth, async (req, res) => {
  try {
    const idParam = req.params.id;

    const old_data = await mySqlQury(
      "SELECT * FROM tbl_drivers WHERE id = ? LIMIT 1",
      [idParam],
    );

    const { first_name, last_name, email, mobile, vehicle_plate, active } =
      req.body;

    await mySqlQury(
      `UPDATE tbl_drivers SET first_name = ?, last_name = ?, email = ?, mobile = ?, vehicle_plate = ?, active = ? WHERE id = ?`,
      [first_name, last_name, email, mobile, vehicle_plate, active, idParam],
    );

    await mySqlQury(
      `UPDATE tbl_admin SET first_name = ?, last_name = ?, email = ?, phone_no = ? WHERE email = ?`,
      [first_name, last_name, email, mobile, old_data[0].email],
    );

    req.flash("success", `Added successfully`);
    res.redirect("/users/drivers");
  } catch (error) {
    console.log(error);
  }
});

router.get("/drivers/delete/:id", auth, async (req, res) => {
  try {
    const idParam = req.params.id;

    const old_data = await mySqlQury(
      "SELECT * FROM tbl_drivers WHERE id = ? LIMIT 1",
      [idParam],
    );

    await mySqlQury("DELETE FROM tbl_drivers WHERE id = ?", [idParam]);

    await mySqlQury("DELETE FROM tbl_admin WHERE email = ?", [old_data[0].email]);

    req.flash("success", `Deleted successfully`);
    res.redirect("/users/drivers");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
