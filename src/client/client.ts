import { ClientExampleController } from "./controllers/exampleController";
import { Config } from "../shared/config";
import { Locales, t } from "../shared/locale";

class ClientApp {
  private exampleController: ClientExampleController;

  constructor() {
    this.exampleController = new ClientExampleController();
    this.registerCommandsAndBinds();

    if (Config.debug) {
      console.log("[it_tsTemplate] Client bereit.");
    }
  }

  private registerCommandsAndBinds(): void {
    // Chat Command registrieren
    RegisterCommand(
      Config.ui.command,
      () => {
        this.exampleController.toggleUI();
      },
      false,
    );

    // Keymapping (Taste im GTA Tastenbelegungsmenü editierbar)
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
