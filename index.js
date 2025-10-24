// VARIABLES GLOBALES PARA EL SISTEMA DE PASOS
let seleccion = {
    tipoSolicitud: '',
    ambiente: '',
    tipoJob: ''
};

// Variable que guarda el paso actual (1, 2, 3, o 4 cuando está en formulario)
let pasoActual = 1;

// FUNCIONES PARA NAVEGACIÓN POR PASOS
function seleccionarTipoSolicitud(tipo) {
    seleccion.tipoSolicitud = tipo;
    document.getElementById('tipo-selected').textContent = tipo.toUpperCase();
    document.getElementById('tipo-selected-2').textContent = tipo.toUpperCase();
    
    document.getElementById('paso-1').style.display = 'none';
    document.getElementById('paso-2').style.display = 'block';
    document.getElementById('paso-3').style.display = 'none';
    
    pasoActual = 2;
    console.log('→ Paso 2: Selección de ambiente');
}

function seleccionarAmbiente(ambiente) {
    seleccion.ambiente = ambiente;
    document.getElementById('ambiente-selected').textContent = ambiente.toUpperCase();
    
    document.getElementById('paso-1').style.display = 'none';
    document.getElementById('paso-2').style.display = 'none';
    document.getElementById('paso-3').style.display = 'block';
    
    pasoActual = 3;
    console.log('→ Paso 3: Selección de tipo de job');
}

function seleccionarJob(tipoJob) {
    seleccion.tipoJob = tipoJob;
    
    // Ocultar todos los pasos
    document.getElementById('paso-1').style.display = 'none';
    document.getElementById('paso-2').style.display = 'none';
    document.getElementById('paso-3').style.display = 'none';
    
    // Mostrar resumen
    const resumen = document.getElementById('resumen-seleccion');
    resumen.classList.add('visible');
    
    // Mapeo de nombres
    const nombresJobs = {
        'os': 'Script / CMD',
        'sap': 'SAP',
        'file-transfer': 'File Transfer',
        'database': 'Database',
        'sap-btp-scheduler': 'SAP BTP Scheduler',
        'web-services-rest': 'Web Services REST',
        'veeam-backup': 'Veeam Backup',
        'azure-webjob': 'Azure App Services',
        'endpoint': 'Endpoint',  
        'webjob': 'WebJob',      
        'masiva': 'Masiva'
    };
    
    // Llenar resumen
    document.getElementById('resumen-tipo').textContent = seleccion.tipoSolicitud;
    document.getElementById('resumen-ambiente').textContent = seleccion.ambiente;
    document.getElementById('resumen-job').textContent = nombresJobs[tipoJob] || tipoJob;
    
    // Mostrar formulario
    const form = document.getElementById('form-' + tipoJob);
    console.log('Buscando formulario:', 'form-' + tipoJob);
    console.log('Formulario encontrado:', form);
    
    if (form) {
        form.style.display = 'block';
        
        // ✅ Pre-llenar campos Y BLOQUEARLOS
        const selectTipo = form.querySelector('[name^="tipo_solicitud"]');
        const selectAmbiente = form.querySelector('[name^="ambiente"]');
        
        if (selectTipo) {
            selectTipo.value = seleccion.tipoSolicitud;
            selectTipo.disabled = true;
            selectTipo.classList.add('campo-bloqueado');
        }
        
        if (selectAmbiente) {
            selectAmbiente.value = seleccion.ambiente;
            selectAmbiente.disabled = true;
            selectAmbiente.classList.add('campo-bloqueado');
        }
        
        // Scroll al resumen
        resumen.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Inicializar campos cíclicos
        if (typeof window.inicializarCiclico === 'function') {
            window.inicializarCiclico(form);
        }
        
        pasoActual = 4;
        console.log('→ Paso 4: Formulario visible -', nombresJobs[tipoJob]);
    }
}

// FUNCIÓN PARA VOLVER AL PASO ANTERIOR
function volverAlPasoAnterior() {
    console.log('=== VOLVER - Paso actual:', pasoActual);
    
    if (pasoActual === 4) {
        // Desde formulario → Paso 3 (selección de jobs)
        console.log('Desde formulario → Paso 3');
        
        // ✅ Ocultar TODOS los formularios Y DESBLOQUEAR CAMPOS
        const forms = document.querySelectorAll('.custom-form');
        forms.forEach(form => {
            form.style.display = 'none';
            
            // Desbloquear campos
            const selectTipo = form.querySelector('[name^="tipo_solicitud"]');
            const selectAmbiente = form.querySelector('[name^="ambiente"]');
            
            if (selectTipo) {
                selectTipo.disabled = false;
                selectTipo.classList.remove('campo-bloqueado');
            }
            
            if (selectAmbiente) {
                selectAmbiente.disabled = false;
                selectAmbiente.classList.remove('campo-bloqueado');
            }
        });
        
        // Ocultar resumen
        document.getElementById('resumen-seleccion').classList.remove('visible');
        
        // Mostrar paso 3
        document.getElementById('paso-1').style.display = 'none';
        document.getElementById('paso-2').style.display = 'none';
        document.getElementById('paso-3').style.display = 'block';
        
        // Limpiar selección de job
        seleccion.tipoJob = '';
        pasoActual = 3;
        
    } else if (pasoActual === 3) {
        // Desde Paso 3 → Paso 2 (selección de ambiente)
        console.log('Desde Paso 3 → Paso 2');
        
        document.getElementById('paso-1').style.display = 'none';
        document.getElementById('paso-2').style.display = 'block';
        document.getElementById('paso-3').style.display = 'none';
        
        seleccion.ambiente = '';
        pasoActual = 2;
        
    } else if (pasoActual === 2) {
        // Desde Paso 2 → Paso 1 (tipo de solicitud)
        console.log('Desde Paso 2 → Paso 1');
        
        document.getElementById('paso-1').style.display = 'block';
        document.getElementById('paso-2').style.display = 'none';
        document.getElementById('paso-3').style.display = 'none';
        
        seleccion.tipoSolicitud = '';
        pasoActual = 1;
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log('Nuevo paso actual:', pasoActual);
}

// Función para resetear todo (botón del resumen)
function volverAlPaso3() {
    console.log('=== RESETEAR TODO');
    
    // Ocultar todos los formularios
    const forms = document.querySelectorAll('.custom-form');
    forms.forEach(form => form.style.display = 'none');
    
    // Ocultar todos los pasos
    document.getElementById('paso-1').style.display = 'block';
    document.getElementById('paso-2').style.display = 'none';
    document.getElementById('paso-3').style.display = 'none';
    
    // Ocultar resumen
    document.getElementById('resumen-seleccion').classList.remove('visible');
    
    // Resetear selección
    seleccion = { tipoSolicitud: '', ambiente: '', tipoJob: '' };
    
    // Volver al paso 1
    pasoActual = 1;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Función para volver a un paso específico (breadcrumb)
function volverPaso(numeroPaso) {
    console.log('=== BREADCRUMB - Volver a paso', numeroPaso);
    
    // Ocultar todos los pasos
    document.getElementById('paso-1').style.display = 'none';
    document.getElementById('paso-2').style.display = 'none';
    document.getElementById('paso-3').style.display = 'none';
    
    // Ocultar todos los formularios
    const forms = document.querySelectorAll('.custom-form');
    forms.forEach(form => form.style.display = 'none');
    
    // Ocultar resumen
    document.getElementById('resumen-seleccion').classList.remove('visible');
    
    // Mostrar el paso solicitado
    document.getElementById('paso-' + numeroPaso).style.display = 'block';
    
    // Actualizar estado
    pasoActual = numeroPaso;
    
    // Limpiar selecciones según el paso
    if (numeroPaso === 1) {
        seleccion = { tipoSolicitud: '', ambiente: '', tipoJob: '' };
    } else if (numeroPaso === 2) {
        seleccion.tipoJob = '';
        seleccion.ambiente = '';
    } else if (numeroPaso === 3) {
        seleccion.tipoJob = '';
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Control-M cargado');
    
    // Asegurar que empieza en paso 1
    pasoActual = 1;
    document.getElementById('paso-1').style.display = 'block';
    document.getElementById('paso-2').style.display = 'none';
    document.getElementById('paso-3').style.display = 'none';
    
    const forms = {
        'os': document.getElementById('form-os'),
        'sap': document.getElementById('form-sap'),
        'file-transfer': document.getElementById('form-file-transfer'),
        'database': document.getElementById('form-database'),
        'azure-webjob': document.getElementById('form-azure-webjob'),
        'sap-btp-scheduler': document.getElementById('form-sap-btp-scheduler'),
        'web-services-rest': document.getElementById('form-web-services-rest'),
        'veeam-backup': document.getElementById('form-veeam-backup'),
        'endpoint': document.getElementById('form-endpoint'),
        'webjob': document.getElementById('form-webjob'),
        'masiva': document.getElementById('form-masiva')
    };

    // Función para inicializar campos cíclicos
function inicializarCiclico(form) {
    const selectCiclico = form.querySelector('.ciclico-select');
    const campos = form.querySelector('.ciclico-campos');
    if (!selectCiclico || !campos) return;
    
    function toggleCampos() {
        if (selectCiclico.value === 'si') {
            // Verificar si está en un grid
            const esGrid = campos.style.gridColumn || campos.parentElement.style.display.includes('grid');
            if (esGrid) {
                campos.style.display = 'grid';
            } else {
                campos.style.display = 'block';
            }
        } else {
            campos.style.display = 'none';
        }
    }

    selectCiclico.addEventListener('change', toggleCampos);
    toggleCampos();
}

    // Inicializar todos los formularios
    for (const key in forms) {
        if (forms[key]) {
            forms[key].style.display = 'none';
            inicializarCiclico(forms[key]);
        }
    }
    
    // Hacer la función accesible globalmente
    window.inicializarCiclico = inicializarCiclico;
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

// Función para cambiar el tipo de autenticación en REST
function cambiarAuthTypeRest(tipo) {
    document.getElementById('section-basic-rest').style.display = 'none';
    document.getElementById('section-oauth2-rest').style.display = 'none';
    document.getElementById('section-aws-rest').style.display = 'none';
    document.getElementById('section-google-rest').style.display = 'none';
    
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

// Funciones para el modal de ayuda
function mostrarAyuda() {
    const modal = document.getElementById('modal-ayuda');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function cerrarAyuda() {
    const modal = document.getElementById('modal-ayuda');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Cerrar modal al hacer clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('modal-ayuda');
    if (modal && event.target === modal) {
        cerrarAyuda();
    }
}

// Cerrar con tecla ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('modal-ayuda');
        if (modal && modal.style.display === 'block') {
            cerrarAyuda();
        }
    }
});