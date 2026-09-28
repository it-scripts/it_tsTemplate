import { ServerExampleController } from "./controllers/exampleController";
import { Locales, t } from "../shared/locale";
import { Config } from "../shared/config";
import { getResourceName } from "../shared/resource";

class ServerApp {
  private exampleController: ServerExampleController;

  constructor() {
    const resourceName = getResourceName();
    console.log("==================================================");
    console.log(`^2[${resourceName}]^7 Server initialisiert`);
    console.log(
      `^2[${resourceName}]^7 Sprache: ^3${Locales.getLocale()}^7 | Debug: ^3${Config.debug}^7`,
    );
    console.log("==================================================");

    this.exampleController = new ServerExampleController();
  }
}

// Initialisiere Server App
new ServerApp();
