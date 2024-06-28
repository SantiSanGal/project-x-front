export function encontrarMultiploMenorDeCinco(numero: number) {
    return Math.floor(numero / 5) * 5;
}

export const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};