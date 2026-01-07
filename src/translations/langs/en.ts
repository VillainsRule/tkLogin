import Translation from '../types';

const en: Translation = {
    NORMAL_LAUNCHER: 'Normal Minecraft Launcher',
    PRISM_LAUNCHER: 'Prism / Poly / MultiMC',
    POJAV_LAUNCHER: 'Pojav Launcher',

    SLOGAN: 'login in to Minecraft with accesstokens. it\'s easy!',

    SAFETY_BUTTON_LABEL: 'How do I know it\'s safe?',
    SAFETY_DIALOG_TITLE: 'How do I know tkLogin is safe?',
    SAFETY_DIALOG_DESCRIPTION: 'tkLogin is built using Github Actions.',
    SAFETY_DIALOG_CONTENT: `Github Actions is a platform that runs scripts on Github's servers. Actions exposes everything about the jar file, including the code and the script that builds it. nightly.link is a trusted website that lets normal users access these builds without being signed into GitHub. If you're a programmer, you can click 'view build' and then 'view run' at the bottom of the mod download section to review the build workflow.`,

    SELECT_VERSION_TITLE: 'Select Your Minecraft Version',
    I_AM_CONFUSED_BUTTON: 'I am confused or I use Pojav Launcher (CLICK THIS)',
    MODERN_VERSION_BUTTON: 'Modern',
    LEGACY_VERSION_BUTTON: 'Legacy',

    SUBVERSION_SELECT_TITLE: 'Select Your 1.21 Version',
    SUBVERSION_SELECT_DESCRIPTION: 'Choose the version that matches your Minecraft installation',

    DOWNLOAD_STARTED: '{{VERSION}} Download Started!',
    REDOWNLOAD_PROMPT_TEXT: 'It may take a moment to start. If it does not download in a few seconds, you can {LINK}.',
    REDOWNLOAD_LINK_LABEL: 'redownload it',
    TUTORIAL_FOR_LAUNCHER: 'Tutorial for {{LAUNCHER}}',

    INSTALL_TUTORIAL_POPUP_TITLE: 'Installation Tutorial',
    INSTALL_TUTORIAL_POPUP_DESCRIPTION: 'Choose your launcher for specific instructions',
    INSTALL_TUTORIAL_INSTALLINGON: 'Installing on {{LAUNCHER}}',
    INSTALL_TUTORIAL_BACKTOLIST: 'Back to launcher list',
    POJAV_KID_CTA: 'POJAV LAUNCHER (POJAV USERS CLICK HERE)',

    VIEW_BUILD_BUTTON: 'View Build',
    VIEW_GITHUB_BUTTON: 'View on GitHub',

    START_OVER_BUTTON: 'Start Over',

    SITE_DESCRIPTION: `tkLogin allows you to log in to Minecraft servers using access tokens. it's the easiest and most accessible (free) method.`,

    TUTORIALS: {
        NORMAL: [
            'Install Fabric',
            'Follow these instructions to add tkLogin'
        ],
        PRISM: [
            'Open Prism Launcher / PolyMC / MultiMC',
            'Click "Add Instance"',
            'Select Fabric mod loader with any supported version',
            'Create the instance',
            'Click "Edit" and select "Mods"',
            'Go to "View Folder" (bottom right) and put the mod in that folder'
        ],
        POJAV: [
            'Open the Pojav Launcher Version Selector',
            'Click on the "Create new profile" button in the version selector.',
            'Select Fabric and the latest Minecraft full version.',
            'In the PojavLauncher menu, you will see "game directory" button, click it.',
            'You will be automatically redirected to .minecraft folder.',
            'Inside you will find the mods folder.',
            'Put the mod you downloaded in there.'
        ]
    }
};

export default en;