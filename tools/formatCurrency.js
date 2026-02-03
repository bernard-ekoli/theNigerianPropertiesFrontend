function formatCustomCurrency(currencyCode, amount) {
    const code = currencyCode.toUpperCase();
    let symbol = '$';

    if (code === 'NGN') {
        symbol = '₦';
    }

    let fixedAmount = Number(amount).toFixed(2);

    // Regex to add commas for thousands separation
    fixedAmount = fixedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return symbol + fixedAmount;
}

export default formatCustomCurrency;