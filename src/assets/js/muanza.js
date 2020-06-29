export function muanza() {
    return Metro;
}

export function notifierSucces(texte) {
    muanza().notify.setup({
        animation: "easeOutBounce",
        duration: 200,
        width: 300,
    });
    muanza().notify.create(texte, null, {
        cls: "success",
    });
}

export function notifierErreur(texte) {
    muanza().notify.setup({
        animation: "easeOutBounce",
        duration: 200,
        width: 300,
    });
    muanza().notify.create(texte, null, {
        cls: "alert",
    });
}
