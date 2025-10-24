// ============================================
// VALIDACIONES.JS - Sistema de validación de formularios Control-M
// ============================================

// ===== EXPRESIONES REGULARES =====
const REGEX = {
    jobname: /^[a-zA-Z0-9_\-\.]+$/,
    servidor: /^[a-zA-Z0-9\-\.]+$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    hora: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
    diasSemana: /^[LMmiJVSD,\s]+$/,
    diasMes: /^(\d{1,2})(,\s*\d{1,2})*$/,
    url: /^https?:\/\/.+/,
    puerto: /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/,
    path: /^[\/\\]?([a-zA-Z0-9_\-\.\s]+[\/\\]?)+$/,
    dependencias: /^[A-Z0-9_\-]+(\.[A-Z0-9_\-]+)*$/i,
    ip: /^(\d{1,3}\.){3}\d{1,3}$/
};

// ===== MENSAJES DE ERROR =====
const MENSAJES = {
    requerido: 'Este campo es obligatorio',
    jobname: 'El jobname solo puede contener letras, números, guiones y guiones bajos (sin espacios)',
    servidor: 'Formato de servidor inválido. Ejemplo: server01.ypf.com o 192.168.1.10',
    email: 'Formato de email inválido. Ejemplo: soporte@ypf.com',
    hora: 'Formato de hora inválido. Use HH:MM (ejemplo: 08:30)',
    diasSemana: 'Use formato: L,M,Mi,J,V,S,D',
    diasMes: 'Use números del 1-31 separados por comas. Ejemplo: 1,15,30',
    diasMesRango: 'Los días del mes deben estar entre 1 y 31',
    url: 'URL inválida. Debe comenzar con http:// o https://',
    puerto: 'Puerto inválido. Debe ser un número entre 1 y 65535',
    path: 'Ruta de archivo inválida',
    dependencias: 'Formato inválido. Use: JOBNAME.TO.JOBNAME',
    intervalo: 'El intervalo debe ser un número entre 1 y 1440 minutos',
    horaDesdeHasta: 'La hora "Desde" debe ser menor que la hora "Hasta"',
    fechaDesdeHasta: 'La fecha "Desde" debe ser anterior a la fecha "Hasta"',
    servidorIgual: 'El servidor de origen no puede ser igual al servidor de destino'
};

// ===== FUNCIÓN PRINCIPAL DE VALIDACIÓN =====
function validarCampo(input, tipoValidacion) {
    const valor = input.value.trim();
    
    // Si está vacío y es required, mostrar error
    if (!valor && input.hasAttribute('required')) {
        mostrarError(input, MENSAJES.requerido);
        return false;
    }
    
    // Si está vacío y no es required, es válido
    if (!valor) {
        limpiarError(input);
        return true;
    }
    
    // Validar según el tipo
    let esValido = true;
    let mensaje = '';
    
    switch(tipoValidacion) {
        case 'jobname':
            esValido = REGEX.jobname.test(valor);
            mensaje = MENSAJES.jobname;
            break;
            
        case 'servidor':
            esValido = REGEX.servidor.test(valor) || REGEX.ip.test(valor);
            mensaje = MENSAJES.servidor;
            break;
            
        case 'email':
            esValido = REGEX.email.test(valor);
            mensaje = MENSAJES.email;
            break;
            
        case 'hora':
            esValido = REGEX.hora.test(valor);
            mensaje = MENSAJES.hora;
            break;
            
        case 'diasSemana':
            esValido = REGEX.diasSemana.test(valor);
            mensaje = MENSAJES.diasSemana;
            break;
            
        case 'diasMes':
            if (!REGEX.diasMes.test(valor)) {
                esValido = false;
                mensaje = MENSAJES.diasMes;
            } else {
                const dias = valor.split(',').map(d => parseInt(d.trim()));
                if (dias.some(d => d < 1 || d > 31 || isNaN(d))) {
                    esValido = false;
                    mensaje = MENSAJES.diasMesRango;
                }
            }
            break;
            
        case 'url':
            esValido = REGEX.url.test(valor);
            mensaje = MENSAJES.url;
            break;
            
        case 'puerto':
            esValido = REGEX.puerto.test(valor);
            mensaje = MENSAJES.puerto;
            break;
            
        case 'path':
            esValido = REGEX.path.test(valor);
            mensaje = MENSAJES.path;
            break;
            
        case 'dependencias':
            esValido = REGEX.dependencias.test(valor);
            mensaje = MENSAJES.dependencias;
            break;
            
        case 'intervalo':
            const num = parseInt(valor);
            esValido = !isNaN(num) && num >= 1 && num <= 1440;
            mensaje = MENSAJES.intervalo;
            break;
    }
    
    if (esValido) {
        limpiarError(input);
    } else {
        mostrarError(input, mensaje);
    }
    
    return esValido;
}

// ===== VALIDACIONES CONTEXTUALES =====
function validarHoraDesdeHasta(inputDesde, inputHasta) {
    const desde = inputDesde.value;
    const hasta = inputHasta.value;
    
    if (!desde || !hasta) return true;
    
    if (desde >= hasta) {
        mostrarError(inputHasta, MENSAJES.horaDesdeHasta);
        return false;
    }
    
    limpiarError(inputHasta);
    return true;
}

function validarFechaDesdeHasta(inputDesde, inputHasta) {
    const desde = inputDesde.value;
    const hasta = inputHasta.value;
    
    if (!desde || !hasta) return true;
    
    if (new Date(desde) >= new Date(hasta)) {
        mostrarError(inputHasta, MENSAJES.fechaDesdeHasta);
        return false;
    }
    
    limpiarError(inputHasta);
    return true;
}

function validarServidoresDiferentes(inputOrigen, inputDestino) {
    const origen = inputOrigen.value.trim().toLowerCase();
    const destino = inputDestino.value.trim().toLowerCase();
    
    if (!origen || !destino) return true;
    
    if (origen === destino) {
        mostrarError(inputDestino, MENSAJES.servidorIgual);
        return false;
    }
    
    limpiarError(inputDestino);
    return true;
}

// ===== FUNCIONES VISUALES =====
function mostrarError(input, mensaje) {
    limpiarError(input);
    
    input.classList.add('input-error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'mensaje-error';
    errorDiv.textContent = mensaje;
    errorDiv.setAttribute('data-error-for', input.name);
    
    input.parentNode.insertBefore(errorDiv, input.nextSibling);
}

function limpiarError(input) {
    input.classList.remove('input-error');
    
    const errorAnterior = input.parentNode.querySelector(`[data-error-for="${input.name}"]`);
    if (errorAnterior) {
        errorAnterior.remove();
    }
}

function limpiarTodosLosErrores(form) {
    const errores = form.querySelectorAll('.mensaje-error');
    errores.forEach(error => error.remove());
    
    const inputsError = form.querySelectorAll('.input-error');
    inputsError.forEach(input => input.classList.remove('input-error'));
}

// ===== VALIDAR FORMULARIO COMPLETO =====
function validarFormulario(form) {
    console.log('🔍 Validando formulario:', form.id);
    limpiarTodosLosErrores(form);
    
    let esValido = true;
    let primerError = null;
    const tipoJob = form.querySelector('[name="tipo_job"]')?.value;
    
    // 1. Validar campos required
    const camposRequired = form.querySelectorAll('[required]');
    console.log('📋 Campos required encontrados:', camposRequired.length);
    
    camposRequired.forEach(campo => {
        if (!campo.value.trim() && !campo.disabled) {
            mostrarError(campo, MENSAJES.requerido);
            esValido = false;
            if (!primerError) primerError = campo;
            console.log('❌ Campo vacío:', campo.name);
        }
    });
    
    // 2. Validar campos por tipo
    const validaciones = {
        'jobname': form.querySelectorAll('[name*="jobname"]'),
        'servidor': form.querySelectorAll('[name*="servidor"]'),
        'email': form.querySelectorAll('[name*="correo"]'),
        'diasSemana': form.querySelectorAll('[name*="dias_semana"]'),
        'diasMes': form.querySelectorAll('[name*="dias_mes"]'),
        'url': form.querySelectorAll('[name*="url"]'),
        'puerto': form.querySelectorAll('[name*="puerto"]'),
        'path': form.querySelectorAll('[name*="path"], [name*="carpeta"]'),
        'dependencias': form.querySelectorAll('[name*="dependencias"]'),
        'intervalo': form.querySelectorAll('[name*="intervalo"]')
    };
    
    for (const [tipo, campos] of Object.entries(validaciones)) {
        campos.forEach(campo => {
            if (campo.value.trim() && !campo.disabled) {
                if (!validarCampo(campo, tipo)) {
                    esValido = false;
                    if (!primerError) primerError = campo;
                    console.log('❌ Validación fallida:', campo.name, 'tipo:', tipo);
                }
            }
        });
    }
    
    // 3. Validaciones contextuales
    const horaDesde = form.querySelector('[name*="hora_desde"]');
    const horaHasta = form.querySelector('[name*="hora_hasta"]');
    if (horaDesde && horaHasta && horaDesde.value && horaHasta.value) {
        if (!validarHoraDesdeHasta(horaDesde, horaHasta)) {
            esValido = false;
            if (!primerError) primerError = horaHasta;
        }
    }
    
    const fechaDesde = form.querySelector('[name*="activo_desde"]');
    const fechaHasta = form.querySelector('[name*="activo_hasta"]');
    if (fechaDesde && fechaHasta && fechaDesde.value && fechaHasta.value) {
        if (!validarFechaDesdeHasta(fechaDesde, fechaHasta)) {
            esValido = false;
            if (!primerError) primerError = fechaHasta;
        }
    }
    
    if (tipoJob === 'file-transfer') {
        const servidorOrigen = form.querySelector('[name*="servidor_origen"]');
        const servidorDestino = form.querySelector('[name*="servidor_destino"]');
        if (servidorOrigen && servidorDestino && servidorOrigen.value && servidorDestino.value) {
            if (!validarServidoresDiferentes(servidorOrigen, servidorDestino)) {
                esValido = false;
                if (!primerError) primerError = servidorDestino;
            }
        }
    }
    
    // Scroll al primer error
    if (!esValido && primerError) {
        primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => primerError.focus(), 300);
    }
    
    console.log('✅ Resultado validación:', esValido ? 'VÁLIDO' : 'INVÁLIDO');
    return esValido;
}

// ===== INICIALIZAR VALIDACIONES =====
function inicializarValidaciones(form) {
    console.log('🔧 Inicializando validaciones en:', form.id);
    
    // Validar en tiempo real
    const campos = form.querySelectorAll('input:not([type="hidden"]), textarea, select');
    
    campos.forEach(campo => {
        campo.addEventListener('blur', function() {
            let tipoValidacion = null;
            
            if (this.name.includes('jobname')) tipoValidacion = 'jobname';
            else if (this.name.includes('servidor')) tipoValidacion = 'servidor';
            else if (this.name.includes('correo')) tipoValidacion = 'email';
            else if (this.name.includes('dias_semana')) tipoValidacion = 'diasSemana';
            else if (this.name.includes('dias_mes')) tipoValidacion = 'diasMes';
            else if (this.name.includes('url')) tipoValidacion = 'url';
            else if (this.name.includes('puerto')) tipoValidacion = 'puerto';
            else if (this.name.includes('path') || this.name.includes('carpeta')) tipoValidacion = 'path';
            else if (this.name.includes('dependencias')) tipoValidacion = 'dependencias';
            else if (this.name.includes('intervalo')) tipoValidacion = 'intervalo';
            
            if (tipoValidacion) {
                validarCampo(this, tipoValidacion);
            }
        });
        
        campo.addEventListener('input', function() {
            if (this.classList.contains('input-error')) {
                limpiarError(this);
            }
        });
    });
    
    // CRÍTICO: Prevenir submit y validar

    form.addEventListener('submit', function(e) {
        console.log('🚀 Formulario intentando enviarse:', this.id);
        
        e.preventDefault();  // SIEMPRE prevenir primero
        e.stopPropagation();
        
        if (!validarFormulario(this)) {
            console.log('❌ Validación fallida - formulario bloqueado');
            
            // Contar errores
            const errores = this.querySelectorAll('.mensaje-error');
            const numErrores = errores.length;
            
            alert(`❌ Hay ${numErrores} error(es) en el formulario.\nPor favor corríjalos antes de enviar.`);
            return false;
        }
        
        console.log('✅ Validación exitosa - formulario válido');
        
        // SIMULACIÓN: Mostrar datos que se enviarían
        const formData = new FormData(this);
        const datos = {};
        
        for (let [key, value] of formData.entries()) {
            datos[key] = value;
        }
        
        console.log('📤 DATOS QUE SE ENVIARÍAN AL BACKEND:', datos);
        
        // Mostrar mensaje de éxito con detalles
        const tipoJob = datos.tipo_job || 'desconocido';
        const descripcion = datos[Object.keys(datos).find(k => k.includes('descripcion'))] || 'Sin descripción';
        
        alert(`✅ ¡FORMULARIO VÁLIDO!\n\n` +
            `Tipo de Job: ${tipoJob}\n` +
            `Descripción: ${descripcion}\n\n` +
            `📋 ${Object.keys(datos).length} campos completados\n\n` +
            `Cuando el backend esté listo, estos datos se enviarán a Flask.`);
        
        // CUANDO TENGAS EL BACKEND, REEMPLAZA TODO LO DE ARRIBA CON:
        // this.submit();
        
        return false;
    });
}

// ===== AUTO-INICIALIZAR AL CARGAR =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 Inicializando sistema de validaciones...');
    
    const formularios = document.querySelectorAll('.custom-form');
    console.log('📋 Formularios encontrados:', formularios.length);
    
    formularios.forEach(form => {
        inicializarValidaciones(form);
    });
    
    console.log('✅ Validaciones inicializadas en', formularios.length, 'formularios');
});