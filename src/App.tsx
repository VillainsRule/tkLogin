import { type ReactNode, useEffect, useState } from 'react'

import { unzip } from 'unzipit'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import { Code, Download, ExternalLink, FileText, Shield } from 'lucide-react'

import getLanguage from './translations/getLanguage'

import './styles.css';

type Step = 'version' | 'subversion' | 'download'
type Version = 'modern' | 'legacy' | null

const LEGACY = { repo: 'VillainsRule/1.8TokenLogin', branch: 'main', buildFile: '18TokenLogin.jar' };
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

export default function App({ language }: { language: string }) {
    const lang = getLanguage(language);

    const tutorialSteps: Record<typeof LAUNCHERS[number], (string | ReactNode)[]> = {
        [lang.NORMAL_LAUNCHER]: lang.TUTORIALS.NORMAL.map((loc, i) => {
            if (i == 0) return <span className='underline' onClick={() => window.open('https://docs.fabricmc.net/players/installing-fabric')}>{loc}</span>
            if (i == 1) return <span className='underline' onClick={() => window.open('https://docs.fabricmc.net/players/installing-mods')}>{loc}</span>

            return loc;
        }),
        [lang.PRISM_LAUNCHER]: lang.TUTORIALS.PRISM,
        [lang.POJAV_LAUNCHER]: lang.TUTORIALS.POJAV,
    }

    const LAUNCHERS = [lang.NORMAL_LAUNCHER, lang.PRISM_LAUNCHER, lang.POJAV_LAUNCHER];

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

    const handleDownload = async (inputVersion: string, alternativeDownload?: boolean) => {
        const downloadInfo = MAPPED_DOWNLOADS[inputVersion as keyof typeof MAPPED_DOWNLOADS];
        const nightlyLink = `https://nightly.link/${downloadInfo.repo}/workflows/build/${downloadInfo.branch}/${downloadInfo.buildFile}.zip`;

        if (alternativeDownload) return window.open(nightlyLink, '_blank');

        try {
            const response = await fetch(`https://cloudflare-cors-anywhere.xov.workers.dev/?` + nightlyLink);
            if (!response.ok) throw new Error('failed to fetch zip');
            const arrayBuffer = await response.arrayBuffer();

            const { entries } = await unzip(arrayBuffer);
            const jarFile = Object.values(entries).find(file => file.name.endsWith('.jar'));

            if (!jarFile) throw new Error('jar not found in zip');

            const jarData = await jarFile.arrayBuffer();

            const blob = new Blob([jarData], { type: 'application/java-archive' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = jarFile.name;

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            location.href = nightlyLink;
        }
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
                            <p className='text-muted-foreground mt-1'>{lang.SLOGAN}</p>
                        </div>

                        {isMounted && <Dialog open={safetyOpen} onOpenChange={setSafetyOpen}>
                            <DialogTrigger asChild>
                                <Button variant='outline' className='gap-2 bg-transparent'>
                                    <Shield className='h-4 w-4' />
                                    {lang.SAFETY_BUTTON_LABEL}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{lang.SAFETY_DIALOG_TITLE}</DialogTitle>
                                    <DialogDescription>{lang.SAFETY_DIALOG_DESCRIPTION}</DialogDescription>
                                </DialogHeader>

                                <div className='space-y-4'>
                                    <p className='text-sm text-muted-foreground'>{lang.SAFETY_DIALOG_CONTENT}</p>
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
                            <h2 className='text-2xl font-bold text-center'>{lang.SELECT_VERSION_TITLE}</h2>
                            <button className='group relative overflow-hidden rounded-lg border-2 border-border hover:border-primary px-8 py-4 transition-all hover:scale-105 text-red-500 text-2xl font-bold' onClick={() => {
                                handleVersionSelect('modern');
                                setSelectedSubversion(MODERN_SUBVERSIONS[0]);
                                setIsKid(true);
                                setStep('download');
                                handleDownload(MODERN_SUBVERSIONS[0]);
                            }}>{lang.I_AM_CONFUSED_BUTTON}</button>

                            <div className='grid md:grid-cols-2 gap-4'>
                                <button
                                    onClick={() => handleVersionSelect('modern')}
                                    className='group relative overflow-hidden rounded-lg border-2 border-border hover:border-primary p-8 text-left transition-all hover:scale-105'
                                >
                                    <div className='absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity' />
                                    <h3 className='text-xl font-bold mb-2'>{lang.MODERN_VERSION_BUTTON}</h3>
                                    <div className='inline-flex items-center gap-2 text-sm font-medium text-muted-foreground'>1.20.5-{MODERN_SUBVERSIONS[0]}</div>
                                </button>

                                <button
                                    onClick={() => handleVersionSelect('legacy')}
                                    className='group relative overflow-hidden rounded-lg border-2 border-border hover:border-primary p-8 text-left transition-all hover:scale-105'
                                >
                                    <div className='absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity' />
                                    <h3 className='text-xl font-bold mb-2'>{lang.LEGACY_VERSION_BUTTON}</h3>
                                    <div className='inline-flex items-center gap-2 text-sm font-medium text-muted-foreground'>1.8.9</div>
                                </button>
                            </div>
                        </Card>
                    )}

                    {step === 'subversion' && (
                        <Card className='p-8'>
                            <h2 className='text-2xl font-bold mb-6 text-center'>{lang.SUBVERSION_SELECT_TITLE}</h2>
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

                                <p className='text-sm text-muted-foreground text-center mt-4'>{lang.SUBVERSION_SELECT_DESCRIPTION}</p>
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
                                    <h2 className='text-2xl font-bold mb-2'>{lang.DOWNLOAD_STARTED.replace('{{VERSION}}', getVersion())}</h2>
                                    <p className='text-muted-foreground text-sm'>
                                        {lang.REDOWNLOAD_PROMPT_TEXT.split('{LINK}')[0]}
                                        <span
                                            className='underline'
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleDownload(getVersion(), true)}
                                        >
                                            {lang.REDOWNLOAD_LINK_LABEL || 'redownload it'}
                                        </span>
                                        {lang.REDOWNLOAD_PROMPT_TEXT.split('{LINK}')[1]}
                                    </p>
                                </div>

                                {isMounted && selectedVersion === 'modern' && <>
                                    {isKid && <div className='flex flex-wrap gap-3 justify-center'>{LAUNCHERS.map((launcher) => {
                                        return (<Button key={launcher} onClick={() => {
                                            setTutorialOpen(true);
                                            setSelectedLauncher('');
                                        }} variant='outline' size='lg' className='gap-2 bg-transparent mb-0 text-xl font-bold text-red-500'>
                                            {launcher == lang.POJAV_LAUNCHER ? lang.POJAV_KID_CTA : lang.TUTORIAL_FOR_LAUNCHER.replace('{{LAUNCHER}}', launcher)}
                                        </Button>)
                                    })}</div>}

                                    <Dialog open={tutorialOpen} onOpenChange={setTutorialOpen}>
                                        {!isKid && <DialogTrigger asChild>
                                            <Button variant='outline' size='lg' className='gap-2 bg-transparent mb-0 text-xl'>
                                                <FileText className='h-4 w-4' />
                                                {lang.INSTALL_TUTORIAL_POPUP_TITLE}
                                            </Button>
                                        </DialogTrigger>}

                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>{lang.INSTALL_TUTORIAL_POPUP_TITLE}</DialogTitle>
                                                <DialogDescription>{lang.INSTALL_TUTORIAL_POPUP_DESCRIPTION}</DialogDescription>
                                            </DialogHeader>

                                            {!selectedLauncher ? (
                                                <div className='space-y-2 py-4'>
                                                    {LAUNCHERS.map((launcher) => (
                                                        <Button
                                                            key={launcher}
                                                            onClick={() => setSelectedLauncher(launcher)}
                                                            variant='outline'
                                                            className={`w-full justify-start ${launcher == lang.POJAV_LAUNCHER ? 'font-bold text-lg' : ''}`}
                                                        >
                                                            {launcher == lang.POJAV_LAUNCHER ? lang.POJAV_KID_CTA : launcher}
                                                        </Button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className='space-y-4 py-4'>
                                                    <h3 className='font-semibold'>{lang.INSTALL_TUTORIAL_INSTALLINGON.replace('{{LAUNCHER}}', selectedLauncher)}</h3>

                                                    <ol className='list-decimal list-inside space-y-2 text-sm'>{tutorialSteps[selectedLauncher].map((step, index) => (
                                                        <li key={index}>{step}</li>
                                                    ))}</ol>

                                                    <Button onClick={() => setSelectedLauncher('')} variant='outline'>{lang.INSTALL_TUTORIAL_BACKTOLIST}</Button>
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
                                        {lang.VIEW_BUILD_BUTTON}
                                    </Button>

                                    <Button onClick={() => {
                                        const version = selectedVersion === 'legacy' ? '1.8.9' : selectedSubversion;
                                        const downloadInfo = MAPPED_DOWNLOADS[version as keyof typeof MAPPED_DOWNLOADS];
                                        const nightlyLink = `https://github.com/${downloadInfo.repo}/tree/${downloadInfo.branch}`;
                                        window.open(nightlyLink, '_blank');
                                    }} variant='outline' className='gap-2 bg-transparent'>
                                        <Code className='h-4 w-4' />
                                        {lang.VIEW_GITHUB_BUTTON}
                                    </Button>
                                </div>}

                                {!isKid && <Button onClick={() => {
                                    setStep('version')
                                    setSelectedVersion(null)
                                    setSelectedSubversion('')
                                }} variant='ghost'>{lang.START_OVER_BUTTON}</Button>}
                            </div>
                        </Card>
                    )}

                    <div className='text-center text-sm text-muted-foreground'>{lang.SITE_DESCRIPTION}</div>
                </div>
            </main>
        </div>
    )
}