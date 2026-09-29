import { ClientExampleController } from "./controllers/exampleController";
import { Config } from "../shared/config";
import { Locales, t } from "../shared/locale";
import { getResourceName } from "../shared/resource";

class ClientApp {
  private exampleController: ClientExampleController;

  constructor() {
    this.exampleController = new ClientExampleController();
    this.registerCommandsAndBinds();

    if (Config.debug) {
      console.log(`[${getResourceName()}] Client bereit.`);
    }
  }

  private registerCommandsAndBinds(): void {
    // Chat Command registrieren für NUI UI Toggle
    RegisterCommand(
      Config.ui.command,
      () => {
        this.exampleController.toggleUI();
      },
      false,
    );

    // Register a chat command for a direct server callback test (WITHOUT NUI)
    RegisterCommand(
      "testcallback",
      () => {
        this.exampleController.exampleDirectServerCallback();
      },
      false,
    );

    // Key mapping (key can be edited in the GTA key mapping menu)
    RegisterKeyMapping(
      Config.ui.command,
      Config.ui.description,
      "keyboard",
      Config.ui.keybind,
    );
  }
}

// Client App starten
new ClientApp();
