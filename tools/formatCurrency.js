function formatCustomCurrency(currencyCode = 'NGN', amount = 0, options = {}) {
    const code = (currencyCode || 'NGN').toUpperCase();
    const numberValue = Number(amount);
    const value = Number.isNaN(numberValue) ? 0 : numberValue;
    const minimumFractionDigits = options.minimumFractionDigits ?? 0;
    const maximumFractionDigits = options.maximumFractionDigits ?? 0;

    const formatted = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: code,
        minimumFractionDigits,
        maximumFractionDigits,
    }).format(value);

    if (options.listingType === 'rent' || options.listingType === 'lease') {
        return `${formatted}/year`;
    }

    return formatted;
}

export default formatCustomCurrency;