interface Translation {
    NORMAL_LAUNCHER: string;
    PRISM_LAUNCHER: string;
    POJAV_LAUNCHER: string; // Pojav Launcher

    SLOGAN: string; // login in to Minecraft with accesstokens. it's easy!

    SAFETY_BUTTON_LABEL: string; // How do I know it's safe?
    SAFETY_DIALOG_TITLE: string; // How do I know tkLogin is safe?
    SAFETY_DIALOG_DESCRIPTION: string; // tkLogin is built using Github Actions.
    SAFETY_DIALOG_CONTENT: string; // Github Actions is a platform that runs scripts on Github's servers. Actions exposes everything about the jar file, including the code and the script that builds it. nightly.link is a trusted website that lets normal users access these builds without being signed into GitHub. If you're a programmer, you can click 'view build' and then 'view run' at the bottom of the mod download section to review the build workflow.

    SELECT_VERSION_TITLE: string; // Select Your Minecraft Version
    I_AM_CONFUSED_BUTTON: string; // I am confused or I use Pojav Launcher (CLICK THIS)
    MODERN_VERSION_BUTTON: string; // Modern
    LEGACY_VERSION_BUTTON: string; // Legacy

    SUBVERSION_SELECT_TITLE: string; // Select Your 1.21 Version
    SUBVERSION_SELECT_DESCRIPTION: string; // Choose the version that matches your Minecraft installation

    DOWNLOAD_STARTED: string; // {{VERSION}} Download Started!
    REDOWNLOAD_PROMPT_TEXT: string; // It may take a moment to start. If it does not download in a few seconds, you can {LINK}.
    REDOWNLOAD_LINK_LABEL: string; // redownload it
    TUTORIAL_FOR_LAUNCHER: string; // Tutorial for {{LAUNCHER}}

    INSTALL_TUTORIAL_POPUP_TITLE: string; // Installation Tutorial
    INSTALL_TUTORIAL_POPUP_DESCRIPTION: string; // Choose your launcher for specific instructions
    INSTALL_TUTORIAL_INSTALLINGON: string; // Installing on {{LAUNCHER}}
    INSTALL_TUTORIAL_BACKTOLIST: string; // Back to launcher list
    POJAV_KID_CTA: string; // POJAV LAUNCHER (POJAV USERS CLICK HERE)

    VIEW_BUILD_BUTTON: string; // View Build
    VIEW_GITHUB_BUTTON: string; // View on GitHub

    START_OVER_BUTTON: string; // Start Over

    SITE_DESCRIPTION: string; // tkLogin allows you to log in to Minecraft servers using access tokens. it's the easiest and most accessible (free) method.

    TUTORIALS: {
        NORMAL: string[]; // ['Install Fabric', 'Follow these instructions to add tkLogin']
        PRISM: string[]; // ['Open Prism Launcher / PolyMC / MultiMC', 'Click "Add Instance"', 'Select Fabric mod loader with any supported version', 'Create the instance', 'Click "Edit" and select "Mods"', 'Go to "View Folder" (bottom right) and put the mod in that folder']
        POJAV: string[]; // ['Open the Pojav Launcher Version Selector', 'Click on the "Create new profile" button in the version selector.', 'Select Fabric and the latest Minecraft full version.', 'In the PojavLauncher menu, you will see "game directory" button, click it.', 'You will be automatically redirected to .minecraft folder.', 'Inside you will find the mods folder.', 'Put the mod you downloaded in there.']
    }
}

export default Translation;