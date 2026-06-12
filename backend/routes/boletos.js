try {

    await enviarBoleto({
        nombre,
        correo,
        folio,
        tipo,
        pdf: rutaPDF
    });

    console.log(
        `📧 Correo enviado ${correo}`
    );

} catch (emailError) {

    console.error(
        '❌ ERROR EMAIL:',
        emailError.message
    );

}
