"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/controllers/Users-controllers/Alter-password-controller.ts
var Alter_password_controller_exports = {};
__export(Alter_password_controller_exports, {
  AlterPasswordController: () => AlterPasswordController,
  RequestPasswordChangeController: () => RequestPasswordChangeController
});
module.exports = __toCommonJS(Alter_password_controller_exports);

// src/data/Database.ts
var import_knex = __toESM(require("knex"));

// src/config/knexfile.ts
var import_process = require("process");
var configKnexDatabase = {
  development: {
    client: "pg",
    connection: import_process.env.DATABASE_URL,
    searchPath: ["knex", "public"],
    migrations: {
      tableName: "knex_migrations",
      extension: "ts"
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};
var knexfile_default = configKnexDatabase;

// src/data/Database.ts
var Database = class {
};
__publicField(Database, "connection", (0, import_knex.default)(knexfile_default.development));

// src/utils/generate-id.ts
var import_uuid = require("uuid");
var generateId = () => (0, import_uuid.v4)();

// src/repositories/Users-repository.ts
var CreateUsersRepository = class extends Database {
  #tableNames = {
    user: "Users",
    account: "Accounts"
  };
  async createAccount(accountId) {
    await Database.connection(this.#tableNames.account).insert({
      id_account: accountId,
      balance: 100
    });
  }
  async create(data) {
    await this.createAccount(data.account_id);
    await Database.connection(this.#tableNames.user).insert({ ...data, verify: false });
  }
  async deleteAccount(idUser) {
    const [user] = await Database.connection(this.#tableNames.user).where("id_user", idUser);
    await Database.connection(this.#tableNames.account).delete().where("id_account", user.account_id);
  }
  async editInfoUser(data, idUser) {
    await Database.connection(this.#tableNames.user).update(data).where("id_user", idUser);
  }
  async updateVerify(verify, codeUser) {
    await Database.connection(this.#tableNames.user).update("verify", verify).where("code", codeUser);
    if (verify === true) {
      await Database.connection(this.#tableNames.user).update("code", generateId()).where("code", codeUser);
    }
    ;
  }
  async findUser(userName, userId) {
    if (userId) {
      const [foundUser2] = await Database.connection(`${this.#tableNames.user} as U`).select("U.id_user", "U.photo_url", "U.user_name", "U.user_email", "U.account_id", "U.password_hash", "U.verify", "A.balance").innerJoin("Accounts as A", "U.account_id", "A.id_account").where("U.id_user", userId);
      const objFormatted = {
        id_user: foundUser2.id_user,
        photo_url: foundUser2.photo_url,
        user_name: foundUser2.user_name,
        user_email: foundUser2.user_email,
        password_hash: foundUser2.password_hash,
        verify: foundUser2.verify,
        account_id: foundUser2.account_id,
        balance: foundUser2.balance
      };
      return objFormatted;
    }
    ;
    const [foundUser] = await Database.connection(`${this.#tableNames.user} as U`).select("id_user", "photo_url", "user_name", "user_email", "account_id", "password_hash", "verify").where("U.user_name", userName);
    return foundUser;
  }
  async findUserByCode(codeUser) {
    const [foundUser] = await Database.connection(this.#tableNames.user).select("id_user", "user_name", "user_email", "code", "verify").where("code", codeUser);
    return foundUser;
  }
  async findUserByEmail(userEmail) {
    const [userFound] = await Database.connection(this.#tableNames.user).select("id_user", "photo_url", "user_email", "user_name", "account_id", "verify", "code").where("user_email", userEmail);
    return userFound;
  }
  async fetchUsers(user_name) {
    const users = await Database.connection(this.#tableNames.user).select("id_user", "photo_url", "user_email", "user_name", "account_id").where("user_name", "ilike", `%${user_name}%`).where("verify", true);
    return users;
  }
};

// src/use-cases/Users-cases/Validations.ts
var yup = __toESM(require("yup"));
var bodyValidation = yup.object().shape({
  user_name: yup.string().required().min(5).max(100).trim(),
  user_email: yup.string().required().email().trim(),
  password: yup.string().required().min(8).trim()
});
var bodyEditValidation = yup.object().shape({
  photo_url: yup.string(),
  user_name: yup.string().min(5).max(100).trim(),
  user_email: yup.string().email().trim(),
  password_hash: yup.string().min(8).trim(),
  verify: yup.boolean()
});
var regexValidatePassword = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/g;
var regexEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

// src/emails/resetPasswordEmail/index.ts
function resetPasswordEmail(userCode) {
  return `
  <!DOCTYPE html>
  <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
  
  <head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
    <style>
      * {
        box-sizing: border-box;
      }
  
      body {
        margin: 0;
        padding: 0;
      }
  
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: inherit !important;
      }
  
      #MessageViewBody a {
        color: inherit;
        text-decoration: none;
      }
  
      p {
        line-height: inherit
      }
  
      .desktop_hide,
      .desktop_hide table {
        mso-hide: all;
        display: none;
        max-height: 0px;
        overflow: hidden;
      }
  
      @media (max-width:660px) {
  
        .desktop_hide table.icons-inner,
        .social_block.desktop_hide .social-table {
          display: inline-block !important;
        }
  
        .icons-inner {
          text-align: center;
        }
  
        .icons-inner td {
          margin: 0 auto;
        }
  
        .image_block img.big,
        .row-content {
          width: 100% !important;
        }
  
        .mobile_hide {
          display: none;
        }
  
        .stack .column {
          width: 100%;
          display: block;
        }
  
        .mobile_hide {
          min-height: 0;
          max-height: 0;
          max-width: 0;
          overflow: hidden;
          font-size: 0px;
        }
  
        .desktop_hide,
        .desktop_hide table {
          display: table !important;
          max-height: none !important;
        }
      }
    </style>
  </head>
  
  <body style="background-color: #f8f8f9; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
    <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f9;">
      <tbody>
        <tr>
          <td>
            <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #1aa19c;">
              <tbody>
                <tr>
                  <td>
                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; background-color: #1aa19c; width: 640px;" width="640">
                      <tbody>
                        <tr>
                          <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                            <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                              <tr>
                                <td class="pad">
                                  <div class="alignment" align="center">
                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                      <tr>
                                        <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 4px solid #1AA19C;"><span>&#8202;</span></td>
                                      </tr>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
              <tbody>
                <tr>
                  <td>
                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 640px;" width="640">
                      <tbody>
                        <tr>
                          <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                            <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                              <tr>
                                <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                  <div class="alignment" align="center" style="line-height:10px"><a href="www.example.com" target="_blank" style="outline:none" tabindex="-1"><img src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/916972_901322/transactions-logo-3.png" style="display: block; height: auto; border: 0; width: 256px; max-width: 100%;" width="256" alt="Your logo." title="Your logo."></a></div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
              <tbody>
                <tr>
                  <td>
                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000000; width: 640px;" width="640">
                      <tbody>
                        <tr>
                          <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                            <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                              <tr>
                                <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                  <div class="alignment" align="center" style="line-height:10px"><a href="www.example.com" target="_blank" style="outline:none" tabindex="-1"><img class="big" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/4036/___passwordreset.gif" style="display: block; height: auto; border: 0; width: 640px; max-width: 100%;" width="640" alt="Image of lock &amp; key." title="Image of lock &amp; key."></a></div>
                                </td>
                              </tr>
                            </table>
                            <table class="divider_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                              <tr>
                                <td class="pad" style="padding-top:30px;">
                                  <div class="alignment" align="center">
                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                      <tr>
                                        <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;"><span>&#8202;</span></td>
                                      </tr>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table class="text_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                              <tr>
                                <td class="pad" style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;">
                                  <div style="font-family: Arial, sans-serif">
                                    <div class style="font-size: 12px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                      <p style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 19.2px;"><span style="font-size:30px;color:#2b303a;"><strong>Voc\xEA solicitou redefini\xE7\xE3o</strong></span></p>
                                      <p style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 19.2px;"><span style="font-size:30px;color:#2b303a;"><strong>de senha?</strong></span></p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table class="text_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                              <tr>
                                <td class="pad" style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;">
                                  <div style="font-family: sans-serif">
                                    <div class style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;">
                                      <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 22.5px;"><span style="color:#808389;font-size:15px;">para redefinir sua senha basta clicar no bot\xE3o abaixo</span></p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table class="button_block block-5" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                              <tr>
                                <td class="pad" style="padding-left:10px;padding-right:10px;padding-top:15px;text-align:center;">
                                  <div class="alignment" align="center">
                                    <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://ng-transactions-system.vercel.app/${userCode}" style="height:62px;width:206px;v-text-anchor:middle;" arcsize="57%" stroke="false" fillcolor="#f7a50c"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="https://ng-transactions-system.vercel.app/${userCode}" target="_blank" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#f7a50c;border-radius:35px;width:auto;border-top:0px solid transparent;font-weight:400;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:15px;padding-bottom:15px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:30px;padding-right:30px;font-size:16px;display:inline-block;letter-spacing:normal;"><span dir="ltr" style="margin: 0; word-break: break-word; line-height: 32px;"><strong>REDEFINIR SENHA</strong></span></span></a>
                                    <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table class="divider_block block-6" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                              <tr>
                                <td class="pad" style="padding-bottom:12px;padding-top:60px;">
                                  <div class="alignment" align="center">
                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                      <tr>
                                        <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;"><span>&#8202;</span></td>
                                      </tr>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
              <tbody>
                <tr>
                  <td>
                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; background-color: #410125; width: 640px;" width="640">
                      <tbody>
                        <tr>
                          <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                            <table class="social_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                              <tr>
                                <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:28px;text-align:center;">
                                  <div class="alignment" align="center">
                                    <table class="social-table" width="104px" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;">
                                      <tr>
                                        <td style="padding:0 10px 0 10px;"><a href="linkedin.com/in/gabriel-silva-souza-developer" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-outline-circle-white/linkedin@2x.png" width="32" height="32" alt="LinkedIn" title="LinkedIn" style="display: block; height: auto; border: 0;"></a></td>
                                        <td style="padding:0 10px 0 10px;"><a href="https://my-site-portfolio-dev.vercel.app/" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-outline-circle-white/website@2x.png" width="32" height="32" alt="Web Site" title="Web Site" style="display: block; height: auto; border: 0;"></a></td>
                                      </tr>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table class="divider_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                              <tr>
                                <td class="pad" style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:25px;">
                                  <div class="alignment" align="center">
                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                      <tr>
                                        <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #555961;"><span>&#8202;</span></td>
                                      </tr>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
  </body>
  
  </html>
  `;
}

// src/errors/CustomError.ts
var CustomError = class extends Error {
  constructor(message, statusCode) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/errors/UsersErrors.ts
var ErrorUserEmailNotFound = class extends CustomError {
  constructor() {
    super(
      `Email n\xE3o encontrado!.`,
      404
    );
  }
};
var ErrorPasswordRegexInvalid = class extends CustomError {
  constructor() {
    super(
      `A senha deve conter no minimo 8 caracteres com no m\xE1ximo 1 digito, 1 letra mai\xFAscula, 1 letra min\xFAscula e um caracter especial. E n\xE3o pode conter espa\xE7os em branco!.`,
      406
    );
  }
};
var ErrorCodeInvalid = class extends CustomError {
  constructor() {
    super(
      `C\xF3digo invalido.`,
      406
    );
  }
};
var ErrorInvalidEmail = class extends CustomError {
  constructor() {
    super(
      `Esse email n\xE3o \xE9 valido!.`,
      406
    );
  }
};
var ErrorEmailRequired = class extends CustomError {
  constructor() {
    super(
      `Email obrigat\xF3rio!.`,
      406
    );
  }
};
var ErrorNewPasswordRequired = class extends CustomError {
  constructor() {
    super(
      `Nova senha \xE9 obrigat\xF3rio!`,
      406
    );
  }
};
var ErrorStandard = class extends CustomError {
  constructor() {
    super(
      `Ops! algo deu errado. Por favor tente de novo mais tarde!.`,
      500
    );
  }
};

// src/use-cases/Users-cases/Alter-password-case.ts
var RequestPasswordChangeCase = class {
  constructor(usersModel, mailAdapter) {
    this.usersModel = usersModel;
    this.mailAdapter = mailAdapter;
  }
  async request(email) {
    if (!email) {
      throw new ErrorEmailRequired();
    }
    ;
    if (!regexEmail.test(email.trim())) {
      throw new ErrorInvalidEmail();
    }
    ;
    const user = await this.usersModel.findUserByEmail(email);
    if (!user) {
      throw new ErrorUserEmailNotFound();
    }
    ;
    try {
      await this.mailAdapter.sendMail({
        email: `${email}`,
        subject: "NG Transa\xE7\xF5es",
        body: resetPasswordEmail(user.code)
      });
      return {
        message: "Um email para voc\xEA redefinir sua senha foi enviado.",
        statusCode: 200
      };
    } catch (error) {
      throw new ErrorStandard();
    }
    ;
  }
};
var AlterPasswordCase = class {
  constructor(usersModel, bcryptAdapter) {
    this.usersModel = usersModel;
    this.bcryptAdapter = bcryptAdapter;
  }
  async alter(request) {
    const { newPassword: password, codeUser } = request;
    const user = await this.usersModel.findUserByCode(codeUser);
    if (!user) {
      throw new ErrorCodeInvalid();
    }
    ;
    if (!password) {
      throw new ErrorNewPasswordRequired();
    }
    ;
    if (password.match(regexValidatePassword) === null) {
      throw new ErrorPasswordRegexInvalid();
    }
    ;
    const newHashPassword = await this.bcryptAdapter.hashEncrypt({ password });
    const generateNewCode = generateId();
    await this.usersModel.editInfoUser({
      password_hash: newHashPassword,
      code: generateNewCode
    }, user.id_user);
    return {
      message: "Senha alterada com sucesso.",
      statusCode: 200
    };
  }
};

// src/adapters/Nodemailer-adapter/Nodemailer-adapter.ts
var import_nodemailer = __toESM(require("nodemailer"));
var transport = import_nodemailer.default.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});
var NodemailerMailAdapter = class {
  async sendMail({ subject, body, email, text }) {
    await transport.sendMail({
      from: `"NG Transa\xE7\xF5es"  <${process.env.EMAIL}>`,
      to: `<${email}>`,
      subject,
      html: body,
      text
    });
  }
};

// src/adapters/Bcrypt-adapter/Bcrypt-adapter.ts
var import_process2 = require("process");
var bcrypt = __toESM(require("bcryptjs"));
var BCryptAdapter = class {
  async hashEncrypt({ password }) {
    const rounds = Number(import_process2.env.BCRYPT_COST);
    const salt = await bcrypt.genSalt(rounds);
    const result = await bcrypt.hash(password, salt);
    return result;
  }
  async compareHash({ password, passwordDatabase }) {
    const result = await bcrypt.compare(password, passwordDatabase);
    return result;
  }
};

// src/controllers/Users-controllers/Alter-password-controller.ts
var AlterPasswordController = class {
  async alter(req, res) {
    const { codeUser } = req.params;
    const {
      newPassword
    } = req.body;
    const createUsersRepository = new CreateUsersRepository();
    const bcryptAdapter = new BCryptAdapter();
    const alterPasswordCase = new AlterPasswordCase(
      createUsersRepository,
      bcryptAdapter
    );
    const result = await alterPasswordCase.alter({
      newPassword,
      codeUser
    });
    return res.status(result.statusCode).json(result.message);
  }
};
var RequestPasswordChangeController = class {
  async request(req, res) {
    const { email } = req.params;
    const createUsersRepository = new CreateUsersRepository();
    const nodemailerMailAdapter = new NodemailerMailAdapter();
    const requestPasswordChangeCase = new RequestPasswordChangeCase(
      createUsersRepository,
      nodemailerMailAdapter
    );
    const result = await requestPasswordChangeCase.request(email);
    return res.status(result.statusCode).json(result.message);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AlterPasswordController,
  RequestPasswordChangeController
});
