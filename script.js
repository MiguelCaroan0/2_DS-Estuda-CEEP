document.addEventListener('DOMContentLoaded', () => {

    // ─── SAUDAÇÃO DINÂMICA + RELÓGIO ───
    const weekdays = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
    const months   = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];

    function updateClock() {
        const now = new Date();
        const h = now.getHours();

        // Saudação
        const greetingLabel = document.getElementById('greeting-label');
        const greetingSub   = document.getElementById('greeting-sub');
        if (greetingLabel) {
            if (h >= 5 && h < 12) {
                greetingLabel.textContent = 'Bom dia,';
                if (greetingSub) greetingSub.textContent = 'Ótimo começo de dia! Veja abaixo o que está no seu plano de hoje.';
            } else if (h >= 12 && h < 18) {
                greetingLabel.textContent = 'Boa tarde,';
                if (greetingSub) greetingSub.textContent = 'Continue firme! Confira suas matérias e tarefas de hoje.';
            } else {
                greetingLabel.textContent = 'Boa noite,';
                if (greetingSub) greetingSub.textContent = 'Hora de revisar o que estudou hoje e se preparar para amanhã.';
            }
        }

        // Data
        const heroWeekday = document.getElementById('hero-weekday');
        const heroDate    = document.getElementById('hero-date');
        if (heroWeekday) heroWeekday.textContent = weekdays[now.getDay()];
        if (heroDate)    heroDate.textContent    = `${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`;

        // Relógio
        const heroTime = document.getElementById('hero-time');
        if (heroTime) {
            const mm = String(now.getMinutes()).padStart(2, '0');
            const ss = String(now.getSeconds()).padStart(2, '0');
            heroTime.textContent = `${String(h).padStart(2,'0')}:${mm}:${ss}`;
        }
    }

    // ─── GRADE DE HORÁRIOS SEMANAL ───
    // Cada dia da semana (0=Dom, 1=Seg … 6=Sáb) mapeia para as matérias daquele dia.
    // Cada matéria tem: subject key, nome, horário, e lista de tópicos com estado done.
    const timetable = {
        1: [ // Segunda
            { subject: 'mat', name: 'Matemática',  time: '7h – 8h40', topics: [
                { text: 'Funções quadráticas',   done: true  },
                { text: 'Equações do 2º grau',   done: true  },
                { text: 'Gráficos de parábola',  done: false },
                { text: 'Exercícios do ENEM',    done: false },
            ]},
            { subject: 'por', name: 'Português',   time: '9h – 10h20', topics: [
                { text: 'Figuras de linguagem',  done: true  },
                { text: 'Redação dissertativa',  done: false },
                { text: 'Interpretação de texto',done: false },
            ]},
            { subject: 'qui', name: 'Química',     time: '10h30 – 12h', topics: [
                { text: 'Estequiometria',        done: false },
                { text: 'Reações de oxirredução',done: false },
            ]},
        ],
        2: [ // Terça
            { subject: 'bio', name: 'Biologia',    time: '7h – 8h', topics: [
                { text: 'Genética mendeliana',   done: true  },
                { text: 'Mutações gênicas',      done: true  },
                { text: 'Engenharia genética',   done: false },
            ]},
            { subject: 'fis', name: 'Física',      time: '8h10 – 9h30', topics: [
                { text: 'Cinemática escalar',    done: true  },
                { text: 'Dinâmica (Newton)',     done: false },
            ]},
            { subject: 'hist', name: 'História',   time: '9h40 – 11h', topics: [
                { text: 'Primeira Guerra Mundial',done: false },
                { text: 'Revolução Russa',       done: false },
            ]},
        ],
        3: [ // Quarta
            { subject: 'mat', name: 'Matemática',  time: '7h – 8h40', topics: [
                { text: 'Progressões aritméticas', done: false },
                { text: 'Progressões geométricas', done: false },
            ]},
            { subject: 'por', name: 'Português',   time: '9h – 10h', topics: [
                { text: 'Crase e pontuação',     done: false },
                { text: 'Concordância verbal',   done: false },
            ]},
            { subject: 'bio', name: 'Biologia',    time: '10h10 – 11h30', topics: [
                { text: 'Ecossistemas',          done: false },
                { text: 'Cadeias alimentares',   done: false },
            ]},
        ],
        4: [ // Quinta
            { subject: 'fis', name: 'Física',      time: '7h – 8h30', topics: [
                { text: 'Energia cinética',      done: false },
                { text: 'Energia potencial',     done: false },
            ]},
            { subject: 'qui', name: 'Química',     time: '8h40 – 10h', topics: [
                { text: 'Termoquímica',          done: false },
                { text: 'Cinética química',      done: false },
            ]},
        ],
        5: [ // Sexta
            { subject: 'mat', name: 'Matemática',  time: '7h – 8h', topics: [
                { text: 'Logaritmos',            done: false },
                { text: 'Função logarítmica',    done: false },
            ]},
            { subject: 'hist', name: 'História',   time: '8h10 – 9h30', topics: [
                { text: 'Segunda Guerra Mundial', done: false },
                { text: 'Guerra Fria',           done: false },
            ]},
            { subject: 'por', name: 'Português',   time: '9h40 – 11h', topics: [
                { text: 'Simulado de redação',   done: false },
            ]},
        ],
        6: [], // Sábado – sem aulas
        0: [], // Domingo – sem aulas
    };

    // Estado persistente dos tópicos por dia (chave: "dayOfWeek-subjectIndex-topicIndex")
    const topicState = {};

    function getAllTopics() {
        let done = 0, total = 0;
        Object.values(timetable).forEach(subjects => {
            subjects.forEach((subj, si) => {
                subj.topics.forEach((t, ti) => {
                    total++;
                    const key = `${Object.keys(timetable).find(k => timetable[k] === subjects)}-${si}-${ti}`;
                    if (key in topicState ? topicState[key] : t.done) done++;
                });
            });
        });
        return { done, total };
    }

    function updateProgressCard() {
        let done = 0, total = 0;
        Object.entries(timetable).forEach(([day, subjects]) => {
            subjects.forEach((subj, si) => {
                subj.topics.forEach((t, ti) => {
                    total++;
                    const key = `${day}-${si}-${ti}`;
                    if (key in topicState ? topicState[key] : t.done) done++;
                });
            });
        });

        const pct = total === 0 ? 0 : Math.round((done / total) * 100);
        const circumference = 2 * Math.PI * 32; // r=32 → ~201

        document.getElementById('prog-done').textContent  = done;
        document.getElementById('prog-total').textContent = total;
        document.getElementById('prog-pct').textContent   = pct + '%';
        document.getElementById('prog-bar').style.width   = pct + '%';

        const arc = document.getElementById('prog-arc');
        if (arc) arc.style.strokeDashoffset = circumference - (pct / 100) * circumference;

        const sub = document.getElementById('prog-sub');
        const left = total - done;
        if (pct === 100) {
            sub.textContent = '🏆 Parabéns! Todos os tópicos concluídos!';
            document.getElementById('prog-done').style.color = 'var(--qui)';
            if (arc) arc.style.stroke = 'var(--qui)';
        } else if (pct >= 70) {
            sub.textContent = `Quase lá! Faltam ${left} tópico${left > 1 ? 's' : ''}.`;
            document.getElementById('prog-done').style.color = 'var(--bio)';
            if (arc) arc.style.stroke = 'var(--bio)';
        } else {
            sub.textContent = `Continue firme! Faltam ${left} tópico${left > 1 ? 's' : ''}.`;
            document.getElementById('prog-done').style.color = 'var(--bio)';
            if (arc) arc.style.stroke = 'var(--bio)';
        }
    }

    function renderSubjectGrid(dayOfWeek) {
        const grid      = document.getElementById('inicio-subject-grid');
        const emptyState = document.getElementById('day-empty-state');
        const note      = document.getElementById('day-filter-note');
        if (!grid) return;

        const subjects = timetable[dayOfWeek] || [];
        grid.innerHTML = '';

        if (subjects.length === 0) {
            grid.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        grid.style.display = '';
        emptyState.style.display = 'none';

        subjects.forEach((subj, si) => {
            const doneCnt  = subj.topics.filter((t, ti) => {
                const k = `${dayOfWeek}-${si}-${ti}`;
                return k in topicState ? topicState[k] : t.done;
            }).length;

            const topicsHtml = subj.topics.map((t, ti) => {
                const k    = `${dayOfWeek}-${si}-${ti}`;
                const isDone = k in topicState ? topicState[k] : t.done;
                return `<li class="topic-item${isDone ? ' done' : ''}" data-day="${dayOfWeek}" data-si="${si}" data-ti="${ti}">
                    <span class="topic-dot"></span><span>${t.text}</span>
                </li>`;
            }).join('');

            const card = document.createElement('article');
            card.className = 'subject-card';
            card.dataset.subject = subj.subject;
            card.innerHTML = `
                <div class="subject-tab"></div>
                <div class="subject-body">
                    <div class="subject-head">
                        <span class="subject-name">${subj.name}</span>
                        <span class="subject-time">${subj.time}</span>
                    </div>
                    <div class="topics">
                        <p class="topics-label">${doneCnt}/${subj.topics.length} tópicos concluídos</p>
                        <ul class="topic-list">${topicsHtml}</ul>
                    </div>
                </div>`;
            grid.appendChild(card);
        });

        // Click em tópico → toggle done + atualiza progress
        grid.querySelectorAll('.topic-item').forEach(li => {
            li.addEventListener('click', () => {
                const day = li.dataset.day;
                const si  = parseInt(li.dataset.si);
                const ti  = parseInt(li.dataset.ti);
                const k   = `${day}-${si}-${ti}`;
                const cur = k in topicState ? topicState[k] : timetable[day][si].topics[ti].done;
                topicState[k] = !cur;
                renderSubjectGrid(parseInt(day));
                updateProgressCard();
            });
        });
    }

    function renderDaysWeek() {
        const container = document.getElementById('inicio-days-week');
        if (!container) return;

        const now = new Date();
        const todayDow = now.getDay(); // 0=Dom … 6=Sáb
        // Gera a semana corrente começando na segunda
        const labels = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
        // Calcula a segunda-feira desta semana
        const monday = new Date(now);
        monday.setDate(now.getDate() - ((todayDow + 6) % 7));

        container.innerHTML = '';
        for (let i = 0; i < 7; i++) {
            const d   = new Date(monday);
            d.setDate(monday.getDate() + i);
            const dow = d.getDay();
            const isToday = dow === todayDow && d.toDateString() === now.toDateString();

            const div = document.createElement('div');
            div.className = 'day' + (isToday ? ' today' : '');
            div.dataset.dow = dow;
            div.innerHTML = `<div class="d-label">${labels[dow]}</div><div class="d-num">${d.getDate()}</div>`;
            container.appendChild(div);
        }

        // Clicar num dia filtra as matérias
        container.querySelectorAll('.day').forEach(d => {
            d.addEventListener('click', () => {
                container.querySelectorAll('.day').forEach(x => x.classList.remove('today'));
                d.classList.add('today');

                const dow  = parseInt(d.dataset.dow);
                const label = d.querySelector('.d-label').textContent;
                const num   = d.querySelector('.d-num').textContent;
                const note  = document.getElementById('day-filter-note');
                if (note) note.textContent = `${label}, dia ${num}`;

                renderSubjectGrid(dow);
            });
        });

        // Render inicial com o dia de hoje
        renderSubjectGrid(todayDow);
        const note = document.getElementById('day-filter-note');
        const todayLabel = labels[todayDow];
        if (note) note.textContent = `Hoje · ${todayLabel}`;
    }

    renderDaysWeek();
    updateProgressCard();
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
            } else if (targetId === 'calendario' && (text.includes('calendário') || text.includes('calendario'))) {
                item.classList.add('active');
            } else if (targetId === 'professor' && text.includes('professor')) {
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
            } else if (text.includes('calendário') || text.includes('calendario')) {
                hash = '#calendario';
            } else if (text.includes('professor')) {
                hash = '#professor';
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


    // ─── CALENDÁRIO ESCOLAR ───
    const calGrid = document.getElementById('school-calendar-grid');
    const calMonthLabel = document.getElementById('cal-month-label');

    if (calGrid) {
        const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
        let currentYear = 2025;
        let currentMonth = 5; // 0-indexed = Junho

        // Static events keyed as "YYYY-M-D"
        const schoolEvents = {
            '2025-5-23': [{ label: 'Início Bimestre', type: 'event-geral' }],
            '2025-5-24': [{ label: 'Aula Redação', type: 'event-aula' }],
            '2025-5-25': [{ label: 'ENEM Lista Mat', type: 'event-prazo' }, { label: 'Redação M.U.', type: 'event-prazo' }],
            '2025-5-26': [{ label: 'Prova Matemática', type: 'event-prova' }],
            '2025-5-27': [{ label: 'Prazo Redação PR', type: 'event-prazo' }],
            '2025-5-28': [{ label: 'Feriado Municipal', type: 'event-feriado' }],
            '2025-6-1':  [{ label: 'Simulado ENEM', type: 'event-prova' }],
            '2025-6-8':  [{ label: 'Física: Vetores', type: 'event-aula' }],
            '2025-6-13': [{ label: 'Recesso — Jul', type: 'event-recesso' }],
            '2025-6-14': [{ label: 'Recesso Escolar', type: 'event-recesso' }],
        };

        function renderCalendar(year, month) {
            // Remove old cells (keep 7 header cells)
            while (calGrid.children.length > 7) {
                calGrid.removeChild(calGrid.lastChild);
            }
            calMonthLabel.textContent = `${monthNames[month]} ${year}`;

            const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            // Convert Sunday=0 to Monday=0 offset
            const offset = (firstDay === 0) ? 6 : firstDay - 1;

            const today = new Date();

            // Blank cells
            for (let i = 0; i < offset; i++) {
                const blank = document.createElement('div');
                blank.className = 'calendar-cell muted';
                blank.innerHTML = '<div class="cell-num"></div>';
                calGrid.appendChild(blank);
            }

            for (let d = 1; d <= daysInMonth; d++) {
                const cell = document.createElement('div');
                const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
                cell.className = 'calendar-cell' + (isToday ? ' today-cell' : '');

                const key = `${year}-${month}-${d}`;
                const events = schoolEvents[key] || [];
                const eventsHtml = events.map(ev => `<span class="cell-event ${ev.type}">${ev.label}</span>`).join('');

                cell.innerHTML = `<div class="cell-num">${d}</div><div class="cell-events">${eventsHtml}</div>`;
                calGrid.appendChild(cell);
            }
        }

        renderCalendar(currentYear, currentMonth);

        document.getElementById('cal-prev').addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) { currentMonth = 11; currentYear--; }
            renderCalendar(currentYear, currentMonth);
        });
        document.getElementById('cal-next').addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) { currentMonth = 0; currentYear++; }
            renderCalendar(currentYear, currentMonth);
        });
    }

    // ─── ÁREA DO PROFESSOR ───

    // Recipient toggle buttons
    const recipientBtns = document.querySelectorAll('.recipient-btn');
    const turmaSelectGroup = document.getElementById('turma-select-group');
    if (recipientBtns.length > 0) {
        recipientBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                recipientBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if (turmaSelectGroup) {
                    turmaSelectGroup.style.display = btn.dataset.target === 'turma' ? 'block' : 'none';
                }
            });
        });
    }

    // Turma chips toggle
    document.querySelectorAll('.turma-chip').forEach(chip => {
        chip.addEventListener('click', () => chip.classList.toggle('selected'));
    });

    // Student tabs
    const studentTabs = document.querySelectorAll('.student-tab');
    studentTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            studentTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.student-tab-content').forEach(c => c.style.display = 'none');
            const target = document.getElementById('tab-' + tab.dataset.tab);
            if (target) target.style.display = 'block';
        });
    });

    // Publish task button
    const profPublishBtn = document.getElementById('prof-publish-btn');
    if (profPublishBtn) {
        profPublishBtn.addEventListener('click', () => {
            const title = document.getElementById('prof-task-title').value.trim();
            const subject = document.getElementById('prof-task-subject').value;
            const due = document.getElementById('prof-task-due').value;
            const platform = document.getElementById('prof-task-platform').value;

            if (!title) { alert('Informe o título da tarefa.'); return; }

            const list = document.getElementById('prof-tasks-list');
            const tagMap = { mat:'Mat', por:'Port', bio:'Bio', qui:'Qui', fis:'Fís', his:'His' };
            const dueText = due ? new Date(due + 'T12:00:00').toLocaleDateString('pt-BR', { day:'2-digit', month:'short' }) : 'sem prazo';
            const platformLabel = { interna:'Estuda CEEP', 'redacao-pr':'Redação Paraná', classroom:'Google Classroom', livro:'Livro Didático' }[platform] || platform;

            const html = `
                <div class="task-item">
                    <div class="task-body">
                        <div class="task-title">${title}</div>
                        <div class="task-meta">Publicada agora · Vence ${dueText} · 0 entregues · ${platformLabel}</div>
                    </div>
                    <span class="task-tag tag-${subject}">${tagMap[subject]}</span>
                </div>`;
            list.insertAdjacentHTML('afterbegin', html);

            document.getElementById('prof-task-title').value = '';
            document.getElementById('prof-task-desc').value = '';
            document.getElementById('prof-task-due').value = '';
            alert(`Tarefa "${title}" publicada com sucesso!`);
        });
    }

    // Sync buttons feedback
    document.querySelectorAll('.sync-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const original = this.textContent;
            this.textContent = 'Sincronizando...';
            this.disabled = true;
            setTimeout(() => {
                this.textContent = '✓ Atualizado';
                setTimeout(() => {
                    this.textContent = original;
                    this.disabled = false;
                }, 2000);
            }, 1200);
        });
    });
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