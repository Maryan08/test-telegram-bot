export const handleError = (ctx, error) => {
    console.error('Error occurred:', error);
    ctx.reply('Виникла помилка. Спробуйте ще раз.');
};