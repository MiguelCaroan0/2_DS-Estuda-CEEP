document.addEventListener('DOMContentLoaded', () => {
    // ─── SPA ROUTING (SHOW/HIDE VIEWS) ───
    const navItems = document.querySelectorAll('.nav-item');
    const pageViews = document.querySelectorAll('.page-view');

    function navigateTo(hash) {
        // Se hash estiver vazio, padrão é 'inicio'
        const targetId = hash ? hash.replace('#', '') : 'inicio';
        
        let targetView = document.getElementById(`view-${targetId}`);
        if (!targetView) {
            targetView = document.getElementById('view-inicio');
        }

        // 1. Ocultar todas as views e exibir a view ativa
        pageViews.forEach(view => {
            view.classList.remove('active');
        });
        targetView.classList.add('active');

        // 2. Atualizar a classe active no menu de navegação
        navItems.forEach(item => {
            item.classList.remove('active');
            const text = item.textContent.trim().toLowerCase();
            
            if (targetId === 'inicio' && (text.includes('início') || text.includes('inicio'))) {
                item.classList.add('active');
            } else if (targetId === 'agenda' && text.includes('agenda')) {
                item.classList.add('active');
            } else if (targetId === 'tarefas' && text.includes('tarefa')) {
                item.classList.add('active');
            } else if (targetId === 'pomodoro' && text.includes('pomodoro')) {
                item.classList.add('active');
            } else if (targetId === 'historico' && (text.includes('histórico') || text.includes('historico'))) {
                item.classList.add('active');
            } else if (targetId === 'materias' && (text.includes('matéria') || text.includes('materia'))) {
                item.classList.add('active');
            }
        });

        // Rolar para o topo da página ao mudar de seção
        window.scrollTo(0, 0);
    }

    // Navega na carga inicial da página
    navigateTo(window.location.hash);

    // Escuta mudanças de hash (botões voltar/avançar do navegador)
    window.addEventListener('hashchange', () => {
        navigateTo(window.location.hash);
    });

    // Vincula cliques da navegação ao hash
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const text = item.textContent.trim().toLowerCase();
            let hash = '#inicio';

            if (text.includes('início') || text.includes('inicio')) {
                hash = '#inicio';
            } else if (text.includes('agenda')) {
                hash = '#agenda';
            } else if (text.includes('tarefa')) {
                hash = '#tarefas';
            } else if (text.includes('pomodoro')) {
                hash = '#pomodoro';
            } else if (text.includes('histórico') || text.includes('historico')) {
                hash = '#historico';
            } else if (text.includes('matéria') || text.includes('materia')) {
                hash = '#materias';
            }

            window.location.hash = hash;
        });
    });

    // ─── TAREFAS INTERATIVAS ───
    const tasksLists = document.querySelectorAll('.tasks-list');
    if (tasksLists.length > 0) {
        document.body.addEventListener('click', (e) => {
            const taskCheck = e.target.closest('.task-check');
            if (taskCheck) {
                const taskItem = taskCheck.closest('.task-item');
                if (taskItem) {
                    taskItem.classList.toggle('done');
                    
                    // Se estivermos na seção de tarefas, movemos o item para a seção correspondente
                    const isDone = taskItem.classList.contains('done');
                    const pendingList = document.querySelector('#view-tarefas .tasks-list:first-of-type');
                    const completedList = document.querySelector('#view-tarefas .tasks-list:last-of-type');
                    
                    if (pendingList && completedList) {
                        if (isDone) {
                            completedList.appendChild(taskItem);
                        } else {
                            pendingList.appendChild(taskItem);
                        }
                    }

                    updateTaskCounts();
                }
            }
        });
    }

    // Filtros de Tarefas (Todas, Pendentes, Concluídas)
    const filterButtons = document.querySelectorAll('#view-tarefas .filter-btn');
    const sectionPending = document.getElementById('section-pending');
    const sectionCompleted = document.getElementById('section-completed');

    if (filterButtons.length > 0 && sectionPending && sectionCompleted) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // 1. Atualizar estilo do botão ativo
                filterButtons.forEach(b => {
                    b.classList.remove('active');
                    b.style.borderColor = '';
                    b.style.color = '';
                });
                btn.classList.add('active');
                btn.style.borderColor = 'var(--qui)';
                btn.style.color = 'var(--qui)';

                // 2. Filtrar seções
                const filter = btn.dataset.filter;
                if (filter === 'todas') {
                    sectionPending.style.display = 'block';
                    sectionCompleted.style.display = 'block';
                } else if (filter === 'pendentes') {
                    sectionPending.style.display = 'block';
                    sectionCompleted.style.display = 'none';
                } else if (filter === 'concluidas') {
                    sectionPending.style.display = 'none';
                    sectionCompleted.style.display = 'block';
                }
            });
        });
    }

    function updateTaskCounts() {
        const totalPending = document.querySelectorAll('#view-tarefas .tasks-list:first-of-type .task-item:not(.done)').length;
        const totalDone = document.querySelectorAll('#view-tarefas .task-item.done').length;
        
        // Atualiza nota
        const note = document.querySelector('#view-tarefas .section-note');
        if (note) {
            note.textContent = `${totalPending} pendentes · ${totalDone} concluídas`;
        }

        // Atualiza contador no cabeçalho de tarefas
        const badge = document.querySelector('#view-tarefas .date-badge');
        if (badge) {
            badge.textContent = `${totalPending} PENDENTES`;
        }

        // Atualiza número de tarefas pendentes nos cards rápidos do início
        const statCardTasks = document.querySelector('.stat-value.accent-mat');
        if (statCardTasks) {
            statCardTasks.textContent = totalPending;
        }
    }

    // Modal / Adicionar Tarefa
    const btnNewTask = document.getElementById('btn-new-task');
    const modalTask = document.getElementById('modal-task');
    const formTask = document.getElementById('form-task');
    const btnCancelTask = document.getElementById('btn-cancel-task');

    if (btnNewTask && modalTask && formTask) {
        btnNewTask.addEventListener('click', () => {
            modalTask.style.display = 'flex';
        });

        btnCancelTask.addEventListener('click', () => {
            modalTask.style.display = 'none';
        });

        formTask.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('task-title-input').value;
            const desc = document.getElementById('task-desc-input').value;
            const subject = document.getElementById('task-subject-input').value;
            const priority = document.getElementById('task-priority-input').value;

            // Criação do elemento HTML da tarefa
            const taskHTML = `
                <div class="task-item">
                    <div class="task-check"></div>
                    <div class="task-body">
                        <div class="task-title">${title}</div>
                        <div class="task-meta">${desc}</div>
                    </div>
                    <div class="task-priority priority-${priority}"></div>
                    <span class="task-tag tag-${subject}">${subject.charAt(0).toUpperCase() + subject.slice(1, 3)}</span>
                </div>
            `;

            const pendingList = document.querySelector('#view-tarefas .tasks-list:first-of-type');
            if (pendingList) {
                pendingList.insertAdjacentHTML('afterbegin', taskHTML);
            }

            modalTask.style.display = 'none';
            formTask.reset();
            updateTaskCounts();
        });
    }

    // ─── TIMER POMODORO ───
    const timerDisplay = document.querySelector('.timer-display');
    if (timerDisplay) {
        let timerInterval;
        let timeRemaining = 25 * 60;
        let totalDuration = 25 * 60;
        let isRunning = false;
        let currentMode = 'pomodoro';

        const btnPlayPause = document.getElementById('pomodoro-play');
        const btnReset = document.getElementById('pomodoro-reset');
        const modeButtons = document.querySelectorAll('.mode-btn');
        const timerCircle = document.querySelector('.pomodoro-timer-circle');

        function updateTimerDisplay() {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            const progressPercent = (timeRemaining / totalDuration) * 100;
            if (timerCircle) {
                timerCircle.style.setProperty('--progress', `${progressPercent}%`);
            }
        }

        function startTimer() {
            if (isRunning) return;
            isRunning = true;
            btnPlayPause.textContent = 'Pausar';
            btnPlayPause.classList.remove('btn-primary');
            btnPlayPause.classList.add('btn-secondary');

            timerInterval = setInterval(() => {
                if (timeRemaining > 0) {
                    timeRemaining--;
                    updateTimerDisplay();
                } else {
                    clearInterval(timerInterval);
                    isRunning = false;
                    alert('Tempo de foco concluído! Faça uma pausa.');
                    resetTimer();
                }
            }, 1000);
        }

        function pauseTimer() {
            if (!isRunning) return;
            isRunning = false;
            clearInterval(timerInterval);
            btnPlayPause.textContent = 'Iniciar';
            btnPlayPause.classList.remove('btn-secondary');
            btnPlayPause.classList.add('btn-primary');
        }

        function resetTimer() {
            pauseTimer();
            if (currentMode === 'pomodoro') {
                timeRemaining = 25 * 60;
            } else if (currentMode === 'short') {
                timeRemaining = 5 * 60;
            } else if (currentMode === 'long') {
                timeRemaining = 15 * 60;
            }
            totalDuration = timeRemaining;
            updateTimerDisplay();
        }

        btnPlayPause.addEventListener('click', () => {
            if (isRunning) {
                pauseTimer();
            } else {
                startTimer();
            }
        });

        btnReset.addEventListener('click', resetTimer);

        modeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                modeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                currentMode = btn.dataset.mode;
                resetTimer();
            });
        });

        resetTimer();
    }

    // ─── AGENDA INTERATIVA ───
    const dayElements = document.querySelectorAll('.days-week .day');
    dayElements.forEach(day => {
        day.addEventListener('click', () => {
            dayElements.forEach(d => d.classList.remove('today'));
            day.classList.add('today');
            
            const dayNum = day.querySelector('.d-num').textContent;
            const dayLabel = day.querySelector('.d-label').textContent;
            
            const note = document.querySelector('#view-agenda .section-note');
            if (note) {
                note.textContent = `Visualizando planejamentos para ${dayLabel}, dia ${dayNum}`;
            }
        });
    });
});
