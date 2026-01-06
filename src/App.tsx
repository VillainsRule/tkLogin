import { type ReactNode, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import { Code, Download, ExternalLink, FileText, Shield } from 'lucide-react'

import './styles.css';

type Step = 'version' | 'subversion' | 'download'
type Version = 'modern' | 'legacy' | null

const LAUNCHERS = ['Normal Launcher', 'Prism / Poly / MultiMC', 'Pojav Launcher']

const LEGACY = { repo: 'VillainsRule/1.8TokenLogin', branch: 'main', buildFile: 'SchubiAuth.jar' };
const V1_20_5_TO_1_21_5 = { repo: 'VillainsRule/1.21TokenLogin', branch: '1.21.5', buildFile: 'TokenLogin.jar' };
const V1_21_6_TO_1_21_8 = { repo: 'VillainsRule/1.21TokenLogin', branch: '1.21.8', buildFile: 'TokenLogin.jar' };
const V1_21_9_PLUS = { repo: 'VillainsRule/1.21TokenLogin', branch: '1.21.10', buildFile: 'TokenLogin.jar' };

const MAPPED_DOWNLOADS = {
    '1.8.9': LEGACY,
    '1.20.5 / 1.20.6': V1_20_5_TO_1_21_5,
    '1.21 / 1.21.1': V1_20_5_TO_1_21_5,
    '1.21.2 / 1.21.3': V1_20_5_TO_1_21_5,
    '1.21.4': V1_20_5_TO_1_21_5,
    '1.21.5': V1_20_5_TO_1_21_5,
    '1.21.6-1.21.8': V1_21_6_TO_1_21_8,
    '1.21.9 / 1.21.10': V1_21_9_PLUS,
    '1.21.11': V1_21_9_PLUS
}

// https://minecraft.wiki/w/Java_Edition_version_history#1.21
const MODERN_SUBVERSIONS = [
    '1.20.5 / 1.20.6',
    '1.21 / 1.21.1',
    '1.21.2 / 1.21.3',
    '1.21.4',
    '1.21.5',
    '1.21.6-1.21.8',
    '1.21.9 / 1.21.10',
    '1.21.11'
].reverse()

const tutorialSteps: Record<typeof LAUNCHERS[number], (string | ReactNode)[]> = {
    'Normal Launcher': [
        <span className='underline' onClick={() => window.open('https://docs.fabricmc.net/players/installing-fabric')}>Install Fabric</span>,
        <span className='underline' onClick={() => window.open('https://docs.fabricmc.net/players/installing-mods')}>Follow these instructions to add tkLogin</span>
    ],
    'Prism / Poly / MultiMC': [
        'Open Prism Launcher / PolyMC / MultiMC',
        'Click "Add Instance"',
        'Select Fabric mod loader with any supported version',
        'Create the instance',
        'Click "Edit" and select "Mods"',
        'Go to "View Folder" (bottom right) and put the mod in that folder'
    ],
    'Pojav Launcher': [
        'Open the Pojav Launcher Version Selector',
        'Click on the "Create new profile" button in the version selector.',
        `Select Fabric and ${MODERN_SUBVERSIONS[0]} as the version.`,
        'In the PojavLauncher menu, you will see "game directory" button, click it.',
        'You will be automatically redirected to .minecraft folder.',
        'Inside you will find the mods folder.',
        'Put the mod you downloaded in there.'
    ]
}

export default function App() {
    const [step, setStep] = useState<Step>('version')
    const [selectedVersion, setSelectedVersion] = useState<Version>(null)
    const [selectedSubversion, setSelectedSubversion] = useState<string>('')
    const [tutorialOpen, setTutorialOpen] = useState(false)
    const [selectedLauncher, setSelectedLauncher] = useState<string>('')
    const [safetyOpen, setSafetyOpen] = useState(false)
    const [isKid, setIsKid] = useState(false)

    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, []);

    const handleVersionSelect = (version: Version) => {
        setSelectedVersion(version);

        if (version === 'modern') setStep('subversion');
        else {
            setStep('download');
            handleDownload('1.8.9');
        }
    }

    const handleDownload = (inputVersion: string, useWindowOpen?: boolean) => {
        const downloadInfo = MAPPED_DOWNLOADS[inputVersion as keyof typeof MAPPED_DOWNLOADS];
        const nightlyLink = `https://nightly.link/${downloadInfo.repo}/workflows/build/${downloadInfo.branch}/${downloadInfo.buildFile}.zip`;

        if (useWindowOpen) {
            try {
                window.open(nightlyLink, '_blank');
            } catch (e) {
                console.error(e);
                location.href = nightlyLink;
            }
        } else location.href = nightlyLink;
    }

    const getVersion = () => {
        if (selectedVersion === 'legacy') return '1.8.9';
        return selectedSubversion || MODERN_SUBVERSIONS[0];
    }

    return (
        <div className='min-h-screen bg-background'>
            <header className='border-b border-border bg-card/50'>
                <div className='container mx-auto px-6 py-4'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <h1 className='text-3xl font-bold text-foreground'>tkLogin</h1>
                            <p className='text-muted-foreground mt-1'>login into Minecraft with accesstokens. it's easy!</p>
                        </div>

                        {isMounted && <Dialog open={safetyOpen} onOpenChange={setSafetyOpen}>
                            <DialogTrigger asChild>
                                <Button variant='outline' className='gap-2 bg-transparent'>
                                    <Shield className='h-4 w-4' />
                                    How do I know it's safe?
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>How do I know tkLogin is safe?</DialogTitle>
                                    <DialogDescription>tkLogin is built using Github Actions.</DialogDescription>
                                </DialogHeader>
                                <div className='space-y-4'>
                                    <p className='text-sm text-muted-foreground'>Github Actions is a platform that runs scripts on Github's servers. Actions exposes everything about the jar file, including the code and the script that builds it. nightly.link is a trusted website that lets normal users access these builds without being signed into GitHub. If you're a programmer, you can click 'view build' and then 'view run' at the bottom of the mod download section to review the build workflow.</p>
                                </div>
                            </DialogContent>
                        </Dialog>}
                    </div>
                </div>
            </header>

            <main className='container mx-auto px-4 py-8'>
                <div className='max-w-3xl mx-auto space-y-8'>
                    <div className='flex items-center justify-center gap-2'>
                        <div className={`h-2 w-16 rounded-full ${step ? 'bg-primary' : 'bg-muted'}`} />
                        <div className={`h-2 w-16 rounded-full ${step === 'subversion' || step === 'download' ? 'bg-primary' : 'bg-muted'}`} />
                        <div className={`h-2 w-16 rounded-full ${step === 'download' ? 'bg-primary' : 'bg-muted'}`} />
                    </div>

                    {step === 'version' && (
                        <Card className='p-8 gap-3'>
                            <h2 className='text-2xl font-bold text-center'>Select Your Minecraft Version</h2>
                            <button className='group relative overflow-hidden rounded-lg border-2 border-border hover:border-primary px-8 py-4 transition-all hover:scale-105' onClick={() => {
                                handleVersionSelect('modern');
                                setSelectedSubversion(MODERN_SUBVERSIONS[0]);
                                setIsKid(true);
                                setStep('download');
                                handleDownload(MODERN_SUBVERSIONS[0]);
                            }}>I don't know what I'm doing OR I use Pojav Launcher</button>

                            <div className='grid md:grid-cols-2 gap-4'>
                                <button
                                    onClick={() => handleVersionSelect('modern')}
                                    className='group relative overflow-hidden rounded-lg border-2 border-border hover:border-primary p-8 text-left transition-all hover:scale-105'
                                >
                                    <div className='absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity' />
                                    <h3 className='text-xl font-bold mb-2'>Modern</h3>
                                    <div className='inline-flex items-center gap-2 text-sm font-medium text-muted-foreground'>1.20.5-{MODERN_SUBVERSIONS[0]}</div>
                                </button>

                                <button
                                    onClick={() => handleVersionSelect('legacy')}
                                    className='group relative overflow-hidden rounded-lg border-2 border-border hover:border-primary p-8 text-left transition-all hover:scale-105'
                                >
                                    <div className='absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity' />
                                    <h3 className='text-xl font-bold mb-2'>Legacy</h3>
                                    <div className='inline-flex items-center gap-2 text-sm font-medium text-muted-foreground'>1.8.9</div>
                                </button>
                            </div>
                        </Card>
                    )}

                    {step === 'subversion' && (
                        <Card className='p-8'>
                            <h2 className='text-2xl font-bold mb-6 text-center'>Select Your 1.21 Version</h2>
                            <div className='space-y-4'>
                                <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                                    {MODERN_SUBVERSIONS.map((subversion, i) => (
                                        <button
                                            key={subversion}
                                            onClick={() => {
                                                setSelectedSubversion(subversion)
                                                setStep('download')
                                                handleDownload(subversion);
                                            }}
                                            className='group relative overflow-hidden rounded-lg border-2 border-border hover:border-primary p-6 text-center transition-all hover:scale-105'
                                        >
                                            <div className='absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity' />
                                            <div className='text-lg font-bold'>{subversion} {i == 0 && '(latest)'}</div>
                                        </button>
                                    ))}
                                </div>

                                <p className='text-sm text-muted-foreground text-center mt-4'>
                                    Choose the version that matches your Minecraft installation
                                </p>
                            </div>
                        </Card>
                    )}

                    {step === 'download' && (
                        <Card className='p-8'>
                            <div className='text-center space-y-6'>
                                {!isKid && <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10'>
                                    <Download className='h-8 w-8 text-primary' />
                                </div>}

                                <div>
                                    <h2 className='text-2xl font-bold mb-2'>{getVersion()} Download Started!</h2>
                                    <p className='text-muted-foreground text-sm'>If it does not start automatically, you can <span className='underline' onClick={() => {
                                        handleDownload(getVersion(), true);
                                    }}>redownload it</span>.</p>
                                </div>

                                {isMounted && selectedVersion === 'modern' && <>
                                    {isKid && <div className='flex flex-wrap gap-3 justify-center'>{LAUNCHERS.map((launcher) => {
                                        return (<Button
                                            key={launcher}
                                            onClick={() => {
                                                setTutorialOpen(true);
                                                setSelectedLauncher('');
                                            }}
                                            variant='outline'
                                            size='lg'
                                            className='gap-2 bg-transparent mb-0 text-xl font-bold'
                                        >
                                            {launcher.includes('Pojav') ? 'POJAV LAUNCHER (POJAV USERS CLICK)' : launcher + ' Tutorial'}
                                        </Button>)
                                    })}</div>}

                                    <Dialog open={tutorialOpen} onOpenChange={setTutorialOpen}>
                                        {!isKid && <DialogTrigger asChild>
                                            <Button variant='outline' size='lg' className='gap-2 bg-transparent mb-0 text-xl'>
                                                <FileText className='h-4 w-4' />
                                                Installation Tutorial
                                            </Button>
                                        </DialogTrigger>}

                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Installation Tutorial</DialogTitle>
                                                <DialogDescription>Choose your launcher for specific instructions</DialogDescription>
                                            </DialogHeader>

                                            {!selectedLauncher ? (
                                                <div className='space-y-2 py-4'>
                                                    {LAUNCHERS.map((launcher) => (
                                                        <Button
                                                            key={launcher}
                                                            onClick={() => setSelectedLauncher(launcher)}
                                                            variant='outline'
                                                            className={`w-full justify-start ${launcher.includes('Pojav') ? 'font-bold text-lg' : ''}`}
                                                        >
                                                            {launcher.includes('Pojav') ? 'POJAV LAUNCHER (POJAV USERS CLICK HERE)' : launcher}
                                                        </Button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className='space-y-4 py-4'>
                                                    <h3 className='font-semibold'>Installing on {selectedLauncher}</h3>
                                                    <ol className='list-decimal list-inside space-y-2 text-sm'>{tutorialSteps[selectedLauncher].map((step, index) => (
                                                        <li key={index}>{step}</li>
                                                    ))}</ol>
                                                    <Button onClick={() => setSelectedLauncher('')} variant='outline'>
                                                        Back to launcher list
                                                    </Button>
                                                </div>
                                            )}
                                        </DialogContent>
                                    </Dialog>
                                </>}

                                {!isKid && <div className='flex flex-col sm:flex-row gap-3 justify-center pt-4 flex-wrap'>
                                    <Button onClick={() => {
                                        const version = selectedVersion === 'legacy' ? '1.8.9' : selectedSubversion;
                                        const downloadInfo = MAPPED_DOWNLOADS[version as keyof typeof MAPPED_DOWNLOADS];
                                        const nightlyLink = `https://nightly.link/${downloadInfo.repo}/workflows/build/${downloadInfo.branch}/${downloadInfo.buildFile}`;
                                        window.open(nightlyLink, '_blank');
                                    }} variant='outline' className='gap-2 bg-transparent'>
                                        <ExternalLink className='h-4 w-4' />
                                        View Build
                                    </Button>

                                    <Button onClick={() => {
                                        const version = selectedVersion === 'legacy' ? '1.8.9' : selectedSubversion;
                                        const downloadInfo = MAPPED_DOWNLOADS[version as keyof typeof MAPPED_DOWNLOADS];
                                        const nightlyLink = `https://github.com/${downloadInfo.repo}/tree/${downloadInfo.branch}`;
                                        window.open(nightlyLink, '_blank');
                                    }} variant='outline' className='gap-2 bg-transparent'>
                                        <Code className='h-4 w-4' />
                                        View Github
                                    </Button>
                                </div>}

                                {!isKid && <Button onClick={() => {
                                    setStep('version')
                                    setSelectedVersion(null)
                                    setSelectedSubversion('')
                                }} variant='ghost'>Start Over</Button>}
                            </div>
                        </Card>
                    )}

                    <div className='text-center text-sm text-muted-foreground'>
                        tkLogin allows you to log in to Minecraft servers using access tokens. it's the easiest and most accessible (free) method.
                    </div>
                </div>
            </main>
        </div>
    )
}