// document.getElementById("pagado").addEventListener("keyup",(event) => {
  
//     let pago= $(event.target).val();
//     let interes=$("#interes").val();
//     let deuda=$("#prestamo").val();
//     let numCuota=$(pago/(deuda/parseFloat(interes)));
//     $("cuota").val(Number(numCuota.toFixed(1)));
     
// });

$(document).ready(function () {
    let fecha;
    $('#fecha_prestamo').change((e) => {
 
       fecha = $(e.target).val();
       cacularfecha(fecha)
          .then(result => {
             // si la promesa se resulve correctamente, muestra el resultado
             $("#cuotas_pe").val(result.Cuotapendiente);
 
          }).catch(err => {
             // si la promesa se resulve incorrectamente, muestra el error
             console.error("Error al calcular", err);
          });
    });

    $('#val_pres').keyup((e) => {
        const deuda = parseInt($('#val_pres').val());
        const pendiente = parseInt($('#cuotas_pe').val());
        const interes = parseInt($('#intereses').val());
  
        const tot = parseFloat(deuda * parseFloat(interes)) /100;
        $('#total').val(tot);
  
      });
 
    $('#modalpagos').on('show.bs.modal', (e) => {
 
       // $('#botonModal').click((e) => {
       const form = $('.formulario')[0];
 
       let interes = parseFloat($("#intereses").val());
       let pendiente = parseFloat($("#cuotas_pe").val());
       let valpres = parseFloat($('#val_pres').val());
       const tot = $('#total').val(); if (isNaN(interes) || isNaN(valpres)) {
          form.classList.remove('was-validated');
          e.preventDefault()//Evita abrir el modal
          e.stopPropagation(); isNaN(interes) ? $("#intereses").addClass('is-invalid')
             : $('#val_pres').addClass('is-invalid'); form.classList.remove('is-invalid')
          return; //detiene el modal 
       } else {
          $('.invalid-feedback').css('display', 'none');
          const formulario = $('.formulario'); const formu = formulario.find('input');
          formu.each(function () { $(this).removeClass('is-invalid'); });
       }
 
       if (!form.checkValidity()) {
          e.preventDefault()//Evita abrir el modal 
          e.stopPropagation()
          form.classList.add('was-validated')
 
          Swal.fire({
             icon: "error",
             title: "Malo por lko cuajajajjajaj",
             text: "Debe llenar todos los campos!",
 
          });
 
          return; //detiene el modal
       } else {
          let deuda
          $('#total').val() !== '' ? deuda = $("#total").val() : deuda = $('#val_pres').val();
          $('#prestamo').val(deuda);
          let interes = $("#intereses").val();
          $('#interes').val(interes + ' %');
          let pendiente = $("#cuotas_pe").val();
 
          $('#valor').keyup((e) => {
             let pago = $(e.target).val();
             calcularPago(pago, deuda, interes, pendiente)
                .then(resultado => {
                   // si la promesa se resulve correctamente, muestra el resultado
                   $('#cuota').val(resultado.numCuota);
                   $("#pago_interes").val(resultado.pagoInteres);
                   $("#pago_capital").val(resultado.pagoCapital);
                   $("#valor_actual").val(resultado.valorActual);
 
                }).catch(error => {
                   // si la promesa se resulve incorrectamente, muestra el error
                   console.error("Error al calcular", error);
 
                });
          });
       }
     
       });
 
       $("#guardar").click(function () {
          Swal.fire({
             icon: "success",
             title: "Guarado",
             timer: 1500
          }).then(() => {
             let cuota = parseFloat($('#cuota').val());
             let cuota_pend = parseFloat($('#cuota_pe').val());
 
             if (cuota > cuota_pend) {
                cuota_pend = 0;
                $('#cuota_pe').val(cuota_pend);
             } else {
                cuota_pend = cuota_pend - cuota;
                $('#cuota_pe').val(cuota_pend);
             }
             $('#total').val($('#valor_actual').val());
             $('#modalpagos').modal("hide");
             let modal = $('#modalpagos').find('input');
             modal.each(function () {
                $(this).val('');
             });
          });
       });
 
    });

 function calcularPago(p, d, i, pe) {
    return new Promise((resolve, reject) => {
       let valInt = d / parseFloat(i);//para saber el valor de la cuota
       let cuota = (p / valInt).toFixed(1);
       let pago_interes = pe * valInt; // total de interes pagados
       // let capital = p - pago_interes;
       let valActual;
       if(pe !== 0 &&cuota <= pe) {
          pago_interes = parseFloat (cuota) * valInt;
          valActual = d - pago_interes;
       } else{
          pago_interes = parseFloat(pe) * valInt;
          valActual = d - p;
       }
       let capital = p - pago_interes;
 
       if (cuota >= 0) {
          resolve({
             numCuota: Number(cuota),
             pagoCapital: capital,
             pagoInteres: pago_interes,
             valorActual: valActual
          });
       } else {
          reject('El cálculo de la cuota es invalido');
       }
    });
 }
 
 function cacularfecha(fec) {
    return new Promise((resolve, reject) => {
 
       let fecha_pres = new Date(fec);
       let fechaActual = new Date();
       // Calcular la diferencia en años y meses
       let difAnios = fechaActual.getFullYear() - fecha_pres.getFullYear();
       let difMes = fechaActual.getMonth() - fecha_pres.getMonth();
       let difdia = fechaActual.getDate() - fecha_pres.getDate();
       //Si la diferencia de los dias es negativa no ha pasado un mes
       if (difdia <= 0) {
          difMes -= 1;
       }
       let pendiente = (difAnios * 12) + difMes;
       if (pendiente === 0) {
          pendiente = 1;
       }
       resolve({
          Cuotapendiente: pendiente
       });
       reject('la cuota pendiente es invalida.');
    });
 }
 