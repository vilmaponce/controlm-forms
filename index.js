// VARIABLES GLOBALES PARA EL SISTEMA DE PASOS
let seleccion = {
    tipoSolicitud: '',
    ambiente: '',
    tipoJob: ''
};

// FUNCIONES PARA NAVEGACIÓN POR PASOS
function seleccionarTipoSolicitud(tipo) {
    seleccion.tipoSolicitud = tipo;
    document.getElementById('tipo-selected').textContent = tipo.toUpperCase();// Actualiza el texto en el resumen
    document.getElementById('tipo-selected-2').textContent = tipo.toUpperCase();// Actualiza el texto en el paso 2
    
    document.getElementById('paso-1').style.display = 'none';// Oculta paso 1
    document.getElementById('paso-2').style.display = 'block';// Muestra paso 2
}

function seleccionarAmbiente(ambiente) {
    seleccion.ambiente = ambiente;
    document.getElementById('ambiente-selected').textContent = ambiente.toUpperCase();
    
    document.getElementById('paso-2').style.display = 'none';
    document.getElementById('paso-3').style.display = 'block';
}
function volverAlPaso3() {
    // Ocultar todos los formularios
    const forms = document.querySelectorAll('.custom-form');
    forms.forEach(form => form.style.display = 'none');
    
    // Ocultar todos los pasos
    document.getElementById('paso-1').style.display = 'none';
    document.getElementById('paso-2').style.display = 'none';
    document.getElementById('paso-3').style.display = 'none';
    
    // Ocultar resumen
    document.getElementById('resumen-seleccion').classList.remove('visible');
    
    // Reiniciar todo
    seleccion = { tipoSolicitud: '', ambiente: '', tipoJob: '' };
    
    // Volver al paso 1
    document.getElementById('paso-1').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function seleccionarJob(tipoJob) {
    seleccion.tipoJob = tipoJob;
    
    document.getElementById('paso-3').style.display = 'none';
    
    // Mostrar resumen
    const resumen = document.getElementById('resumen-seleccion');//aca va el resumen de la seleccion
    resumen.classList.add('visible');
    
    // Ir Llenando estos datos del resumen a medida que los selcciono 
    const nombresJobs = {
        'os': 'Script / CMD',
        'sap': 'SAP',
        'file-transfer': 'File Transfer',
        'database': 'Database',
        'sap-btp-scheduler': 'SAP BTP Scheduler',
        'web-services-rest': 'Web Services REST',
        'veeam-backup': 'Veeam Backup',
        'azure-webjob': 'Azure App Services',
        'masiva': 'Masiva'
    };
    
    document.getElementById('resumen-tipo').textContent = seleccion.tipoSolicitud;
    document.getElementById('resumen-ambiente').textContent = seleccion.ambiente;
    document.getElementById('resumen-job').textContent = nombresJobs[tipoJob] || tipoJob;
    
    const form = document.getElementById('form-' + tipoJob);// Obtener el formulario correspondiente
     console.log('Buscando formulario:', 'form-' + tipoJob);// Debugging   
     console.log('Formulario encontrado:', form);              
    if (form) {
        form.style.display = 'block';// Mostrar el formulario seleccionado
        
        const selectTipo = form.querySelector('[name^="tipo_solicitud"]');
        const selectAmbiente = form.querySelector('[name^="ambiente"]');
        
        if (selectTipo) selectTipo.value = seleccion.tipoSolicitud;
        if (selectAmbiente) selectAmbiente.value = seleccion.ambiente;
        
        // Scroll al resumen primero
        resumen.scrollIntoView({ behavior: 'smooth', block: 'start' });// Luego al formulario
        
        inicializarCiclico(form);
    }
}

function volverPaso(numeroPaso) {
    document.getElementById('paso-1').style.display = 'none';
    document.getElementById('paso-2').style.display = 'none';
    document.getElementById('paso-3').style.display = 'none';
    
    const forms = document.querySelectorAll('.custom-form');
    forms.forEach(form => form.style.display = 'none');// Oculta todos los formularios
    
    document.getElementById('paso-' + numeroPaso).style.display = 'block';// Muestra el paso correspondiente
    
    // Ocultar resumen si volvemos al paso 1 o 2
    
    if (numeroPaso === 1) {
        seleccion = { tipoSolicitud: '', ambiente: '', tipoJob: '' };
    } else if (numeroPaso === 2) {
        seleccion.tipoJob = '';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const select = document.getElementById('lista-jobs');
    const forms = {
        'os': document.getElementById('form-os'),
        'sap': document.getElementById('form-sap'),
        'file-transfer': document.getElementById('form-file-transfer'),
        'database': document.getElementById('form-database'),
        'azure-webjob': document.getElementById('form-azure-webjob'),
        'sap-btp-scheduler': document.getElementById('form-sap-btp-scheduler'),
        'web-services-rest': document.getElementById('form-web-services-rest'),
        'veeam-backup': document.getElementById('form-veeam-backup'),
        'azure-webjob': document.getElementById('form-azure-webjob'),
        'masiva': document.getElementById('form-masiva')
    };

    // Inicializar campos cíclicos
    function inicializarCiclico(form) {
        const selectCiclico = form.querySelector('.ciclico-select');// Selecciona el dropdown cíclico
        const campos = form.querySelector('.ciclico-campos');// Selecciona los campos adicionales
        if (!selectCiclico || !campos) return;// Si no existen, salir
        // Función para mostrar/ocultar campos
        function toggleCampos() {
            campos.style.display = selectCiclico.value === 'si' ? 'block' : 'none';
        }

        selectCiclico.addEventListener('change', toggleCampos);// Escuchar cambios en el dropdown
        toggleCampos();// Inicializar estado
    }

    select.addEventListener('change', function() {
        for (const key in forms) {
            if (forms[key]) forms[key].style.display = 'none';
        }

        const formSeleccionado = forms[this.value];
        if (formSeleccionado) {
            formSeleccionado.style.display = 'block';
            inicializarCiclico(formSeleccionado);
        }
    });

    for (const key in forms) {
        if (forms[key]) inicializarCiclico(forms[key]);
    }
});
// FUNCIONES PARA MASIVA
let contadorJobs = 1;

function agregarJob() {
    contadorJobs++;
    if (contadorJobs > 50) {
        alert('Máximo 50 jobs');
        return;
    }
    
    const contenedor = document.getElementById('contenedor-jobs');
    const nuevaFila = document.createElement('div');
    nuevaFila.className = 'fila-dinamica';
    nuevaFila.innerHTML = `
        <input type="text" name="jobname[]" placeholder="Nombre Job *" required>
        <input type="text" name="descripcion[]" placeholder="Descripción">
        <input type="text" name="servidor[]" placeholder="Servidor">
        <input type="text" name="usuario[]" placeholder="Usuario">
        <button type="button" class="btn-eliminar" onclick="eliminarFila(this)">❌</button>
    `;
    contenedor.appendChild(nuevaFila);
}

function eliminarFila(boton) {
    const fila = boton.parentElement;
    const contenedor = document.getElementById('contenedor-jobs');
    const totalFilas = contenedor.querySelectorAll('.fila-dinamica').length;
    if (totalFilas <= 1) {
        alert('Debe haber al menos un job');
        return;
    }
    fila.remove();
    contadorJobs--;
}

console.log('✅ Control-M cargado');

// Función para cambiar el tipo de autenticación en REST
function cambiarAuthTypeRest(tipo) {
    // Ocultar todas las secciones
    document.getElementById('section-basic-rest').style.display = 'none';
    document.getElementById('section-oauth2-rest').style.display = 'none';
    document.getElementById('section-aws-rest').style.display = 'none';
    document.getElementById('section-google-rest').style.display = 'none';
    
    // Mostrar la sección correspondiente
    if (tipo === 'basic') {
        document.getElementById('section-basic-rest').style.display = 'block';
    } else if (tipo === 'oauth2') {
        document.getElementById('section-oauth2-rest').style.display = 'block';
    } else if (tipo === 'aws') {
        document.getElementById('section-aws-rest').style.display = 'block';
    } else if (tipo === 'google') {
        document.getElementById('section-google-rest').style.display = 'block';
    }
}

// Función para cambiar el método de autenticación en AWS
function cambiarAuthMethodAws(metodo) {
    const sectionKeys = document.getElementById('section-aws-keys');
    if (metodo === 'access_secret_keys') {
        sectionKeys.style.display = 'block';
    } else {
        sectionKeys.style.display = 'none';
    }
}