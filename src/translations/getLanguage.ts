import en from './langs/en'

const getLanguage = (cc: string) => {
    if (cc === 'en') return en;

    return en;
}

export default getLanguage;