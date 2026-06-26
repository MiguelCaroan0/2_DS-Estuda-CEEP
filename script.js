document.addEventListener('DOMContentLoaded', () => {

    // ─── SAUDAÇÃO DINÂMICA + RELÓGIO ───
    const weekdays = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
    const months   = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];

    function updateClock() {
        const now = new Date();
        const h = now.getHours();

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

        const heroWeekday = document.getElementById('hero-weekday');
        const heroDate    = document.getElementById('hero-date');
        if (heroWeekday) heroWeekday.textContent = weekdays[now.getDay()];
        if (heroDate)    heroDate.textContent    = `${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`;

        const heroTime = document.getElementById('hero-time');
        if (heroTime) {
            const mm = String(now.getMinutes()).padStart(2, '0');
            const ss = String(now.getSeconds()).padStart(2, '0');
            heroTime.textContent = `${String(h).padStart(2,'0')}:${mm}:${ss}`;
        }
    }

    updateClock();
    setInterval(updateClock, 1000);

    // ─── GRADE DE HORÁRIOS SEMANAL (INÍCIO) ───
    const timetable = {
        1: [
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
        2: [
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
        3: [
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
        4: [
            { subject: 'fis', name: 'Física',      time: '7h – 8h30', topics: [
                { text: 'Energia cinética',      done: false },
                { text: 'Energia potencial',     done: false },
            ]},
            { subject: 'qui', name: 'Química',     time: '8h40 – 10h', topics: [
                { text: 'Termoquímica',          done: false },
                { text: 'Cinética química',      done: false },
            ]},
        ],
        5: [
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
        6: [],
        0: [],
    };

    const topicState = {};

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
        const circumference = 2 * Math.PI * 32;

        const progDone  = document.getElementById('prog-done');
        const progTotal = document.getElementById('prog-total');
        const progPct   = document.getElementById('prog-pct');
        const progBar   = document.getElementById('prog-bar');
        const arc       = document.getElementById('prog-arc');
        const sub       = document.getElementById('prog-sub');

        if (progDone)  progDone.textContent  = done;
        if (progTotal) progTotal.textContent = total;
        if (progPct)   progPct.textContent   = pct + '%';
        if (progBar)   progBar.style.width   = pct + '%';
        if (arc)       arc.style.strokeDashoffset = circumference - (pct / 100) * circumference;

        if (sub) {
            const left = total - done;
            if (pct === 100) {
                sub.textContent = '🏆 Parabéns! Todos os tópicos concluídos!';
                if (progDone) progDone.style.color = 'var(--qui)';
                if (arc) arc.style.stroke = 'var(--qui)';
            } else if (pct >= 70) {
                sub.textContent = `Quase lá! Faltam ${left} tópico${left > 1 ? 's' : ''}.`;
            } else {
                sub.textContent = `Continue firme! Faltam ${left} tópico${left > 1 ? 's' : ''}.`;
            }
        }
    }

    function renderSubjectGrid(dayOfWeek) {
        const grid       = document.getElementById('inicio-subject-grid');
        const emptyState = document.getElementById('day-empty-state');
        const note       = document.getElementById('day-filter-note');
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
            const doneCnt = subj.topics.filter((t, ti) => {
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
        const todayDow = now.getDay();
        const labels = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
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

        renderSubjectGrid(todayDow);
        const note = document.getElementById('day-filter-note');
        if (note) note.textContent = `Hoje · ${labels[todayDow]}`;
    }

    renderDaysWeek();
    updateProgressCard();

    // ─── SPA ROUTING ───
    const navItems  = document.querySelectorAll('.nav-item');
    const pageViews = document.querySelectorAll('.page-view');

    function navigateTo(hash) {
        const targetId = hash ? hash.replace('#', '') : 'inicio';
        let targetView = document.getElementById(`view-${targetId}`);
        if (!targetView) targetView = document.getElementById('view-inicio');

        pageViews.forEach(view => view.classList.remove('active'));
        targetView.classList.add('active');

        navItems.forEach(item => {
            item.classList.remove('active');
            const text = item.textContent.trim().toLowerCase();
            if (targetId === 'inicio'     && (text.includes('início') || text.includes('inicio'))) item.classList.add('active');
            else if (targetId === 'agenda'    && text.includes('agenda'))    item.classList.add('active');
            else if (targetId === 'tarefas'   && text.includes('tarefa'))    item.classList.add('active');
            else if (targetId === 'historico' && (text.includes('histórico') || text.includes('historico'))) item.classList.add('active');
            else if (targetId === 'materias'  && (text.includes('matéria')   || text.includes('materia')))   item.classList.add('active');
            else if (targetId === 'calendario'&& (text.includes('calendário')|| text.includes('calendario')))item.classList.add('active');
            else if (targetId === 'professor' && text.includes('professor'))  item.classList.add('active');
        });

        if (targetId === 'agenda')  initAgenda();
        if (targetId === 'tarefas') initTarefas();
        window.scrollTo(0, 0);
    }

    navigateTo(window.location.hash);
    window.addEventListener('hashchange', () => navigateTo(window.location.hash));

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const text = item.textContent.trim().toLowerCase();
            let hash = '#inicio';
            if (text.includes('início') || text.includes('inicio'))           hash = '#inicio';
            else if (text.includes('agenda'))                                  hash = '#agenda';
            else if (text.includes('tarefa'))                                  hash = '#tarefas';
            else if (text.includes('histórico') || text.includes('historico'))hash = '#historico';
            else if (text.includes('matéria')   || text.includes('materia'))  hash = '#materias';
            else if (text.includes('calendário')|| text.includes('calendario'))hash = '#calendario';
            else if (text.includes('professor'))                               hash = '#professor';
            window.location.hash = hash;
        });
    });

    // ─── AGENDA DE ESTUDOS ───
    const AGENDA_DAYS = [
        { label:'Seg', num:'23', fullLabel:'Segunda-feira, 23 jun', key:'seg', dow:1 },
        { label:'Ter', num:'24', fullLabel:'Terça-feira, 24 jun',   key:'ter', dow:2 },
        { label:'Qua', num:'25', fullLabel:'Quarta-feira, 25 jun',  key:'qua', dow:3 },
        { label:'Qui', num:'26', fullLabel:'Quinta-feira, 26 jun',  key:'qui', dow:4 },
        { label:'Sex', num:'27', fullLabel:'Sexta-feira, 27 jun',   key:'sex', dow:5 },
        { label:'Sáb', num:'28', fullLabel:'Sábado, 28 jun',        key:'sab', dow:6 },
        { label:'Dom', num:'29', fullLabel:'Domingo, 29 jun',       key:'dom', dow:0 },
    ];

    const AGENDA_SUBJECTS = {
        mat: { name:'Matemática', tag:'Mat', cssVar:'--mat' },
        por: { name:'Português',  tag:'Port',cssVar:'--port'},
        bio: { name:'Biologia',   tag:'Bio', cssVar:'--bio' },
        qui: { name:'Química',    tag:'Qui', cssVar:'--qui' },
        fis: { name:'Física',     tag:'Fís', cssVar:'--fis' },
        his: { name:'História',   tag:'His', cssVar:'--hist'},
    };

    const AGENDA_HOURS = [
        '07:00','08:00','09:00','10:00','11:00','12:00',
        '13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'
    ];

    const AI_PLAN = {
        seg: [
            { time:'07:00', subject:'mat', title:'Lista ENEM — Funções' },
            { time:'09:00', subject:'por', title:'Redação: introdução e tese' },
            { time:'12:00', type:'intervalo', title:'Intervalo / Almoço' },
            { time:'14:00', subject:'qui', title:'Estequiometria — cap. 8' },
        ],
        ter: [
            { time:'07:00', subject:'bio', title:'Genética Mendeliana' },
            { time:'09:00', subject:'fis', title:'Cinemática vetorial' },
            { time:'12:00', type:'intervalo', title:'Intervalo / Almoço' },
            { time:'14:00', subject:'his', title:'Era Vargas — revisão' },
        ],
        qua: [
            { time:'07:00', subject:'mat', title:'Parábolas — exercícios ENEM' },
            { time:'09:00', subject:'por', title:'Redação: mobilidade urbana' },
            { time:'12:00', type:'intervalo', title:'Intervalo / Almoço' },
            { time:'14:00', subject:'bio', title:'Engenharia genética' },
        ],
        qui: [
            { time:'07:00', subject:'fis', title:'Energia cinética e potencial' },
            { time:'09:00', subject:'qui', title:'Exercícios estequiometria' },
            { time:'12:00', type:'intervalo', title:'Intervalo / Almoço' },
            { time:'14:00', subject:'mat', title:'Revisão geral — lista ENEM' },
        ],
        sex: [
            { time:'07:00', subject:'por', title:'Simulado de redação' },
            { time:'09:00', subject:'his', title:'Segunda Guerra / Guerra Fria' },
            { time:'12:00', type:'intervalo', title:'Intervalo / Almoço' },
            { time:'14:00', subject:'bio', title:'Revisão Biologia — Ecossistemas' },
        ],
        sab: [], dom: [],
    };

    const SCHOOL_SCHEDULE = {
        seg: [
            { time:'07:00', subject:'mat', title:'Matemática — aula escolar', school: true },
            { time:'09:00', subject:'por', title:'Português — aula escolar',  school: true },
            { time:'10:30', subject:'qui', title:'Química — aula escolar',    school: true },
        ],
        ter: [
            { time:'07:00', subject:'bio', title:'Biologia — aula escolar',   school: true },
            { time:'08:10', subject:'fis', title:'Física — aula escolar',     school: true },
            { time:'09:40', subject:'his', title:'História — aula escolar',   school: true },
        ],
        qua: [
            { time:'07:00', subject:'mat', title:'Matemática — aula escolar', school: true },
            { time:'09:00', subject:'por', title:'Português — aula escolar',  school: true },
            { time:'10:10', subject:'bio', title:'Biologia — aula escolar',   school: true },
        ],
        qui: [
            { time:'07:00', subject:'fis', title:'Física — aula escolar',     school: true },
            { time:'08:40', subject:'qui', title:'Química — aula escolar',    school: true },
        ],
        sex: [
            { time:'07:00', subject:'mat', title:'Matemática — aula escolar', school: true },
            { time:'08:10', subject:'his', title:'História — aula escolar',   school: true },
            { time:'09:40', subject:'por', title:'Português — aula escolar',  school: true },
        ],
        sab: [], dom: [],
    };

    let agendaSchedule = { seg:[], ter:[], qua:[], qui:[], sex:[], sab:[], dom:[] };
    let agendaActiveDay = 'qua';
    let agendaViewMode = 'estudos';
    let agendaInitialized = false;

    function agendaApplyAIPlan() {
        Object.keys(AI_PLAN).forEach(k => {
            agendaSchedule[k] = AI_PLAN[k].map(e => ({ ...e }));
        });
        agendaUpdateSummary();
        agendaRenderDays();
        agendaRenderPlanner();
    }

    function agendaRenderDays() {
        const row = document.getElementById('agenda-days-row');
        if (!row) return;
        row.innerHTML = '';

        AGENDA_DAYS.forEach(d => {
            const ev = agendaSchedule[d.key] || [];
            const subjects = [...new Set(ev.filter(e => e.subject).map(e => e.subject))].slice(0, 4);
            const isWeekend = d.key === 'sab' || d.key === 'dom';

            const div = document.createElement('div');
            div.className = 'day agenda-day' + (d.key === agendaActiveDay ? ' today' : '') + (isWeekend ? ' agenda-day-weekend' : '');

            const dots = subjects.map(s =>
                `<span class="agenda-day-dot" style="background:var(${AGENDA_SUBJECTS[s]?.cssVar || '--borda-cinza'})"></span>`
            ).join('');

            div.innerHTML = `
                <div class="d-label">${d.label}</div>
                <div class="d-num">${d.num}</div>
                <div class="agenda-day-dots">${dots}</div>
            `;
            div.addEventListener('click', () => {
                agendaActiveDay = d.key;
                agendaRenderDays();
                agendaRenderPlanner();
            });
            row.appendChild(div);
        });
    }

    function agendaRenderPlanner() {
        const area = document.getElementById('agenda-planner-area');
        const titleEl = document.getElementById('agenda-planner-title');
        if (!area) return;

        const day = AGENDA_DAYS.find(d => d.key === agendaActiveDay);
        if (titleEl) titleEl.textContent = day.fullLabel;

        if (agendaActiveDay === 'sab' || agendaActiveDay === 'dom') {
            area.innerHTML = `
                <div class="agenda-empty-state">
                    <div class="day-empty-icon">🎉</div>
                    <div class="day-empty-title">Fim de semana livre</div>
                    <div class="day-empty-sub">Aproveite para descansar ou revisar o que estudou!</div>
                </div>`;
            return;
        }

        const source = agendaViewMode === 'escola'
            ? (SCHOOL_SCHEDULE[agendaActiveDay] || [])
            : (agendaSchedule[agendaActiveDay] || []);

        const evMap = {};
        source.forEach(e => { evMap[e.time] = e; });

        const wrap = document.createElement('div');
        wrap.className = 'agenda-planner-grid';

        AGENDA_HOURS.forEach(h => {
            const ev = evMap[h];

            const timeLabel = document.createElement('div');
            timeLabel.className = 'agenda-time-label';
            timeLabel.textContent = h;

            const slotWrap = document.createElement('div');
            slotWrap.className = 'agenda-slot-wrap';

            const slot = document.createElement('div');
            slot.className = 'agenda-slot';

            if (ev) {
                const subj = ev.subject || 'intervalo';
                const isIntervalo = ev.type === 'intervalo';
                const isSchool = ev.school;
                slot.classList.add('agenda-slot--filled');

                const subjInfo = AGENDA_SUBJECTS[subj];
                const tagHtml = subjInfo
                    ? `<span class="agenda-event-tag tag-${subj}">${subjInfo.tag}</span>`
                    : `<span class="agenda-event-tag agenda-tag-intervalo">—</span>`;

                const schoolBadge = isSchool
                    ? `<span class="agenda-school-badge">Escola</span>`
                    : '';

                slot.innerHTML = `
                    <div class="agenda-event agenda-event--${subj}">
                        <div class="agenda-event-left">
                            <div class="agenda-event-name">${ev.title}</div>
                            <div class="agenda-event-meta">${h} · ${isIntervalo ? 'Pausa' : (subjInfo?.name || 'Pausa')}${schoolBadge}</div>
                        </div>
                        ${tagHtml}
                    </div>`;

                if (agendaViewMode === 'estudos') {
                    slot.title = 'Duplo clique para remover';
                    slot.addEventListener('dblclick', () => {
                        agendaSchedule[agendaActiveDay] = agendaSchedule[agendaActiveDay].filter(x => x.time !== h);
                        agendaUpdateSummary();
                        agendaRenderPlanner();
                        agendaRenderDays();
                    });
                }
            } else {
                if (agendaViewMode === 'estudos') {
                    slot.classList.add('agenda-slot--empty');
                    slot.innerHTML = `<span class="agenda-slot-hint">+ adicionar</span>`;
                    slot.addEventListener('click', () => {
                        const sel = document.getElementById('agenda-modal-time');
                        if (sel) sel.value = h;
                        agendaOpenModal();
                    });
                }
            }

            slotWrap.appendChild(slot);

            const row = document.createElement('div');
            row.className = 'agenda-planner-row';
            row.appendChild(timeLabel);
            row.appendChild(slotWrap);
            wrap.appendChild(row);
        });

        area.innerHTML = '';
        area.appendChild(wrap);
    }

    function agendaUpdateSummary() {
        let totalAulas = 0;
        Object.values(agendaSchedule).forEach(day => {
            day.forEach(e => { if (e.subject) totalAulas++; });
        });
        const horasEst = totalAulas * 1.5;

        const elAulas = document.getElementById('agenda-sum-aulas');
        const elHoras = document.getElementById('agenda-sum-horas');
        const elMeta  = document.getElementById('agenda-sum-meta');
        if (elAulas) elAulas.textContent = totalAulas;
        if (elHoras) elHoras.textContent = horasEst.toFixed(0) + 'h';
        if (elMeta)  elMeta.textContent  = Math.min(100, Math.round(totalAulas / 15 * 100)) + '%';
    }

    function agendaOpenModal() {
        const m = document.getElementById('agenda-modal');
        if (m) m.style.display = 'flex';
    }

    function agendaCloseModal() {
        const m = document.getElementById('agenda-modal');
        if (m) m.style.display = 'none';
    }

    function initAgenda() {
        if (agendaInitialized) {
            agendaRenderDays();
            agendaRenderPlanner();
            agendaUpdateSummary();
            return;
        }
        agendaInitialized = true;

        const view = document.getElementById('view-agenda');
        if (!view) return;

        view.innerHTML = `
        <div class="content">
            <div class="page-header">
                <div>
                    <h1 class="page-title">Agenda de Estudos</h1>
                    <p>Organize seu plano diário e semanal</p>
                </div>
                <div class="date-badge">JUNHO · Semana Atual</div>
            </div>

            <div class="agenda-ai-banner">
                <div>
                    <div class="agenda-ai-title">✦ Plano sugerido disponível para esta semana</div>
                    <div class="agenda-ai-sub">Baseado nas suas tarefas pendentes e histórico de estudos</div>
                </div>
                <button class="btn btn-primary" id="agenda-btn-apply-banner">Aplicar plano</button>
            </div>

            <div class="agenda-action-row">
                <button class="btn btn-primary" id="agenda-btn-apply">✦ Plano Sugerido (IA)</button>
                <button class="btn btn-secondary" id="agenda-btn-toggle-view">Ver horário escolar</button>
                <button class="btn btn-secondary" id="agenda-btn-clear">Limpar dia</button>
                <button class="btn btn-secondary" id="agenda-btn-add">+ Adicionar aula</button>
            </div>

            <div class="agenda-summary-row">
                <div class="stat-card">
                    <div class="stat-label">Horas planejadas</div>
                    <div class="stat-value accent-qui" id="agenda-sum-horas">—</div>
                    <div class="stat-sub">esta semana</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Sessões</div>
                    <div class="stat-value accent-port" id="agenda-sum-aulas">—</div>
                    <div class="stat-sub">aulas agendadas</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Ofensiva</div>
                    <div class="stat-value accent-bio">5 dias</div>
                    <div class="stat-sub">estudando seguido</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Meta semanal</div>
                    <div class="stat-value accent-mat" id="agenda-sum-meta">—</div>
                    <div class="stat-sub">concluída</div>
                </div>
            </div>

            <div class="section">
                <div class="section-head">
                    <h2 class="section-title">Semana</h2>
                    <span class="section-note" id="agenda-view-note">Plano de estudos</span>
                </div>
                <div class="days-week" id="agenda-days-row"></div>
            </div>

            <div class="section">
                <div class="section-head">
                    <h2 class="section-title" id="agenda-planner-title">Quarta-feira, 25 jun</h2>
                    <span class="section-note">Duplo clique num evento para remover</span>
                </div>
                <div id="agenda-planner-area"></div>
            </div>

            <div class="section">
                <div class="section-head">
                    <h2 class="section-title">Calendário Escolar e Provas</h2>
                    <span class="section-note">Feriados, Provas e Eventos da CEEP</span>
                </div>
                <div class="calendar-grid">
                    <div class="calendar-header-day">Seg</div>
                    <div class="calendar-header-day">Ter</div>
                    <div class="calendar-header-day">Qua</div>
                    <div class="calendar-header-day">Qui</div>
                    <div class="calendar-header-day">Sex</div>
                    <div class="calendar-header-day">Sáb</div>
                    <div class="calendar-header-day">Dom</div>
                    <div class="calendar-cell muted"><div class="cell-num">22</div></div>
                    <div class="calendar-cell">
                        <div class="cell-num">23</div>
                        <div class="cell-events"><span class="cell-event event-geral">Início Bimestre</span></div>
                    </div>
                    <div class="calendar-cell">
                        <div class="cell-num">24</div>
                        <div class="cell-events"><span class="cell-event event-aula">Aula Redação</span></div>
                    </div>
                    <div class="calendar-cell today-cell">
                        <div class="cell-num">25</div>
                        <div class="cell-events">
                            <span class="cell-event event-prazo">ENEM Lista</span>
                            <span class="cell-event event-prazo">Redação M.U.</span>
                        </div>
                    </div>
                    <div class="calendar-cell">
                        <div class="cell-num">26</div>
                        <div class="cell-events"><span class="cell-event event-prova">Prova Mat.</span></div>
                    </div>
                    <div class="calendar-cell">
                        <div class="cell-num">27</div>
                        <div class="cell-events"><span class="cell-event event-prazo">Prazo Redação</span></div>
                    </div>
                    <div class="calendar-cell">
                        <div class="cell-num">28</div>
                        <div class="cell-events"><span class="cell-event event-feriado">Feriado Municipal</span></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal-overlay" id="agenda-modal" style="display:none;">
            <div class="modal-content">
                <div class="modal-title">Adicionar aula</div>
                <div class="form-group">
                    <label class="form-label" for="agenda-modal-subject">Matéria</label>
                    <select id="agenda-modal-subject" class="form-input">
                        <option value="mat">Matemática</option>
                        <option value="por">Português</option>
                        <option value="bio">Biologia</option>
                        <option value="qui">Química</option>
                        <option value="fis">Física</option>
                        <option value="his">História</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label" for="agenda-modal-title">Título / Tópico</label>
                    <input type="text" id="agenda-modal-title" class="form-input" placeholder="Ex: Funções do 2º grau">
                </div>
                <div class="form-group">
                    <label class="form-label" for="agenda-modal-time">Horário</label>
                    <select id="agenda-modal-time" class="form-input">
                        ${AGENDA_HOURS.map(h => `<option value="${h}">${h}</option>`).join('')}
                    </select>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" id="agenda-modal-cancel">Cancelar</button>
                    <button type="button" class="btn btn-primary"   id="agenda-modal-confirm">Adicionar</button>
                </div>
            </div>
        </div>`;

        document.getElementById('agenda-btn-apply').addEventListener('click', agendaApplyAIPlan);
        document.getElementById('agenda-btn-apply-banner').addEventListener('click', agendaApplyAIPlan);

        document.getElementById('agenda-btn-clear').addEventListener('click', () => {
            agendaSchedule[agendaActiveDay] = [];
            agendaUpdateSummary();
            agendaRenderPlanner();
            agendaRenderDays();
        });

        document.getElementById('agenda-btn-add').addEventListener('click', agendaOpenModal);

        document.getElementById('agenda-btn-toggle-view').addEventListener('click', function() {
            agendaViewMode = agendaViewMode === 'estudos' ? 'escola' : 'estudos';
            this.textContent = agendaViewMode === 'escola' ? 'Ver plano de estudos' : 'Ver horário escolar';
            const note = document.getElementById('agenda-view-note');
            if (note) note.textContent = agendaViewMode === 'escola' ? 'Horário escolar (somente leitura)' : 'Plano de estudos';
            agendaRenderPlanner();
        });

        document.getElementById('agenda-modal-cancel').addEventListener('click', agendaCloseModal);

        document.getElementById('agenda-modal').addEventListener('click', function(e) {
            if (e.target === this) agendaCloseModal();
        });

        document.getElementById('agenda-modal-confirm').addEventListener('click', () => {
            const subj  = document.getElementById('agenda-modal-subject').value;
            const title = document.getElementById('agenda-modal-title').value.trim()
                || AGENDA_SUBJECTS[subj].name;
            const time  = document.getElementById('agenda-modal-time').value;

            const day = agendaSchedule[agendaActiveDay];
            const idx = day.findIndex(e => e.time === time);
            if (idx > -1) day.splice(idx, 1);
            day.push({ time, subject: subj, title });
            day.sort((a, b) => a.time.localeCompare(b.time));

            document.getElementById('agenda-modal-title').value = '';
            agendaCloseModal();
            agendaUpdateSummary();
            agendaRenderPlanner();
            agendaRenderDays();
        });

        agendaApplyAIPlan();
    }

    // ─── TAREFAS (REDESENHADO) ───────────────────────────────────────────────

    const TASK_SUBJECTS = {
        mat: { name:'Matemática', tag:'Mat',  color:'var(--mat)',  bg:'rgba(255,138,91,0.15)'  },
        por: { name:'Português',  tag:'Port', color:'var(--port)', bg:'rgba(95,179,232,0.15)'  },
        bio: { name:'Biologia',   tag:'Bio',  color:'var(--bio)',  bg:'rgba(111,207,122,0.15)' },
        qui: { name:'Química',    tag:'Qui',  color:'var(--qui)',  bg:'rgba(255,209,102,0.15)' },
        fis: { name:'Física',     tag:'Fís',  color:'var(--fis)',  bg:'rgba(255,107,157,0.15)' },
        his: { name:'História',   tag:'His',  color:'var(--hist)', bg:'rgba(199,146,234,0.15)' },
    };

    const PRIO_COLOR  = { alta:'var(--fis)', media:'var(--qui)', baixa:'var(--bio)' };
    const PRIO_LABEL  = { alta:'Alta', media:'Média', baixa:'Baixa' };
    const PRIO_ORDER  = { alta:0, media:1, baixa:2 };

    let taskList = [
        { id:1,  title:'Resolver lista de parábolas (ENEM 2022)', desc:'Vence hoje · 20 questões · Integrado do Classroom',      subject:'mat', priority:'alta',  done:false, due:'2025-06-25' },
        { id:2,  title:'Escrever redação sobre mobilidade urbana', desc:'Vence hoje · mín. 30 linhas · Redação Paraná',           subject:'por', priority:'alta',  done:false, due:'2025-06-25' },
        { id:3,  title:'Exercícios de estequiometria — cap. 8',   desc:'Vence qui, 26 jun · pág. 112–118 · Livro Didático',      subject:'qui', priority:'media', done:false, due:'2025-06-26' },
        { id:4,  title:'Resumo: Cinemática vetorial',             desc:'Vence sex, 27 jun · 1 página · Caderno de Física',       subject:'fis', priority:'media', done:false, due:'2025-06-27' },
        { id:5,  title:'Mapa mental — Engenharia genética',       desc:'Vence sáb, 28 jun · Atividade de Biologia',              subject:'bio', priority:'baixa', done:false, due:'2025-06-28' },
        { id:6,  title:'Rever anotações — Funções quadráticas',   desc:'Concluída ontem',                                        subject:'mat', priority:'media', done:true,  due:'2025-06-24' },
        { id:7,  title:'Ler capítulo sobre Era Vargas',           desc:'Concluída seg, 23 jun',                                  subject:'his', priority:'baixa', done:true,  due:'2025-06-23' },
        { id:8,  title:'Exercícios — Genética mendeliana',        desc:'Concluída seg, 23 jun',                                  subject:'bio', priority:'media', done:true,  due:'2025-06-23' },
    ];
    let nextTaskId = 9;
    let taskFilter     = 'todas';
    let taskSubjFilter = 'todas';
    let taskSortBy     = 'prazo';
    let tarefasInitialized = false;

    const TODAY_DATE = new Date().toISOString().slice(0, 10);

    function taskDueClass(t) {
        if (t.done || !t.due) return '';
        if (t.due < TODAY_DATE) return 'tf-due-late';
        if (t.due === TODAY_DATE) return 'tf-due-today';
        return '';
    }

    function taskGetFiltered() {
        let list = [...taskList];
        if (taskFilter === 'pendentes')  list = list.filter(t => !t.done);
        if (taskFilter === 'concluidas') list = list.filter(t =>  t.done);
        if (taskSubjFilter !== 'todas')  list = list.filter(t => t.subject === taskSubjFilter);

        list.sort((a, b) => {
            if (taskSortBy === 'prioridade') return PRIO_ORDER[a.priority] - PRIO_ORDER[b.priority];
            if (taskSortBy === 'materia')    return a.subject.localeCompare(b.subject);
            return (a.due || '9999').localeCompare(b.due || '9999');
        });
        return list;
    }

    function taskToggleDone(id) {
        const t = taskList.find(t => t.id === id);
        if (t) t.done = !t.done;
        tarefasRender();
    }

    function taskDelete(id) {
        taskList = taskList.filter(t => t.id !== id);
        tarefasRender();
    }

    function taskCardHTML(t) {
        const s  = TASK_SUBJECTS[t.subject] || { name:t.subject, tag:t.subject, color:'var(--borda-cinza)', bg:'transparent' };
        const dc = taskDueClass(t);
        const dueIcon = dc === 'tf-due-today' ? '🔔 ' : dc === 'tf-due-late' ? '⚠️ ' : '';

        return `
        <div class="tf-card task-item${t.done ? ' done' : ''}" data-id="${t.id}">
            <div class="tf-accent" style="background:${s.color}"></div>
            <div class="tf-inner">
                <button class="tf-check task-check" data-id="${t.id}" aria-label="Marcar como ${t.done ? 'pendente' : 'concluída'}">
                    <div class="tf-check-mark"></div>
                </button>
                <div class="task-body">
                    <div class="task-title">${t.title}</div>
                    <div class="task-meta${dc ? ' ' + dc : ''}">${dueIcon}${t.desc}</div>
                </div>
                <div class="tf-right">
                    <span class="tf-prio-dot" style="background:${PRIO_COLOR[t.priority]}" title="Prioridade ${PRIO_LABEL[t.priority]}"></span>
                    <span class="task-tag tag-${t.subject}">${s.tag}</span>
                    <button class="tf-del" data-id="${t.id}" title="Remover tarefa">✕</button>
                </div>
            </div>
        </div>`;
    }

    function tarefasRender() {
        const view = document.getElementById('view-tarefas');
        if (!view || !tarefasInitialized) return;

        const pend   = taskList.filter(t => !t.done);
        const conc   = taskList.filter(t =>  t.done);
        const hoje   = pend.filter(t => t.due === TODAY_DATE).length;
        const atras  = pend.filter(t => t.due && t.due < TODAY_DATE).length;
        const total  = taskList.length;
        const pct    = total === 0 ? 0 : Math.round((conc.length / total) * 100);

        const badge = view.querySelector('.tf-badge');
        if (badge) badge.textContent = `${pend.length} PENDENTES`;

        const sPend  = view.querySelector('#tf-stat-pend');
        const sConc  = view.querySelector('#tf-stat-conc');
        const sHoje  = view.querySelector('#tf-stat-hoje');
        const sAtras = view.querySelector('#tf-stat-atras');
        const bar    = view.querySelector('#tf-progress-bar');
        const pctEl  = view.querySelector('#tf-progress-pct');

        if (sPend)  sPend.textContent  = pend.length;
        if (sConc)  sConc.textContent  = conc.length;
        if (sHoje)  sHoje.textContent  = hoje;
        if (sAtras) sAtras.textContent = atras;
        if (bar)    bar.style.width    = pct + '%';
        if (pctEl)  pctEl.textContent  = pct + '%';

        const listEl = view.querySelector('#tf-list');
        if (!listEl) return;

        const filtered = taskGetFiltered();

        if (!filtered.length) {
            listEl.innerHTML = `
                <div class="tf-empty">
                    <div class="tf-empty-icon">✅</div>
                    <div class="tf-empty-title">Nenhuma tarefa aqui</div>
                    <div class="tf-empty-sub">Tudo em ordem por este filtro!</div>
                </div>`;
            return;
        }

        if (taskFilter === 'todas' && taskSubjFilter === 'todas') {
            const pList = filtered.filter(t => !t.done);
            const cList = filtered.filter(t =>  t.done);
            let html = '';
            if (pList.length) {
                html += `<div class="tf-section-label">Pendentes <span class="tf-count">${pList.length}</span></div>`;
                html += pList.map(taskCardHTML).join('');
            }
            if (cList.length) {
                html += `<div class="tf-section-label tf-section-done">Concluídas <span class="tf-count">${cList.length}</span></div>`;
                html += cList.map(taskCardHTML).join('');
            }
            listEl.innerHTML = html;
        } else {
            listEl.innerHTML = filtered.map(taskCardHTML).join('');
        }

        listEl.querySelectorAll('.tf-check').forEach(el => {
            el.addEventListener('click', () => taskToggleDone(Number(el.dataset.id)));
        });
        listEl.querySelectorAll('.tf-del').forEach(el => {
            el.addEventListener('click', e => { e.stopPropagation(); taskDelete(Number(el.dataset.id)); });
        });
    }

    function tarefasOpenModal(prefill) {
        const m = document.getElementById('tf-modal');
        if (!m) return;
        m.querySelector('#tf-modal-title').value    = prefill?.title    || '';
        m.querySelector('#tf-modal-desc').value     = prefill?.desc     || '';
        m.querySelector('#tf-modal-subject').value  = prefill?.subject  || 'mat';
        m.querySelector('#tf-modal-priority').value = prefill?.priority || 'media';
        m.querySelector('#tf-modal-due').value      = prefill?.due      || '';
        m.style.display = 'flex';
        setTimeout(() => m.querySelector('#tf-modal-title').focus(), 50);
    }

    function tarefasCloseModal() {
        const m = document.getElementById('tf-modal');
        if (m) m.style.display = 'none';
    }

    function initTarefas() {
        if (tarefasInitialized) { tarefasRender(); return; }
        tarefasInitialized = true;

        const view = document.getElementById('view-tarefas');
        if (!view) return;

        view.innerHTML = `
        <div class="content">
            <div class="page-header">
                <div>
                    <h1 class="page-title">Tarefas</h1>
                    <p>Acompanhe e gerencie suas atividades escolares</p>
                </div>
                <div class="date-badge tf-badge">5 PENDENTES</div>
            </div>

            <!-- Stats rápidos -->
            <div class="stats-row">
                <div class="stat-card">
                    <div class="stat-label">Pendentes</div>
                    <div class="stat-value accent-mat" id="tf-stat-pend">—</div>
                    <div class="stat-sub">a fazer</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Concluídas</div>
                    <div class="stat-value accent-bio" id="tf-stat-conc">—</div>
                    <div class="stat-sub">finalizadas</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Vencem hoje</div>
                    <div class="stat-value accent-qui" id="tf-stat-hoje">—</div>
                    <div class="stat-sub">prazo hoje</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Atrasadas</div>
                    <div class="stat-value accent-port" id="tf-stat-atras">—</div>
                    <div class="stat-sub">em atraso</div>
                </div>
            </div>

            <!-- Barra de progresso -->
            <div class="tf-progress-card">
                <div class="tf-progress-head">
                    <span class="tf-progress-label">Progresso geral</span>
                    <span class="tf-progress-pct" id="tf-progress-pct">0%</span>
                </div>
                <div class="progress-container">
                    <div class="progress-bar bio" id="tf-progress-bar" style="width:0%"></div>
                </div>
                <div class="tf-progress-legend">
                    <span class="tf-leg-item"><span class="tf-leg-dot" style="background:var(--mat)"></span>Mat</span>
                    <span class="tf-leg-item"><span class="tf-leg-dot" style="background:var(--port)"></span>Port</span>
                    <span class="tf-leg-item"><span class="tf-leg-dot" style="background:var(--bio)"></span>Bio</span>
                    <span class="tf-leg-item"><span class="tf-leg-dot" style="background:var(--qui)"></span>Qui</span>
                    <span class="tf-leg-item"><span class="tf-leg-dot" style="background:var(--fis)"></span>Fís</span>
                    <span class="tf-leg-item"><span class="tf-leg-dot" style="background:var(--hist)"></span>His</span>
                </div>
            </div>

            <!-- Controles -->
            <div class="tf-controls">
                <div class="tf-controls-left">
                    <div class="tf-filter-group" id="tf-status-filters">
                        <button class="tf-filter-btn active" data-filter="todas">Todas</button>
                        <button class="tf-filter-btn" data-filter="pendentes">Pendentes</button>
                        <button class="tf-filter-btn" data-filter="concluidas">Concluídas</button>
                    </div>
                    <div class="tf-divider"></div>
                    <div class="tf-filter-group" id="tf-subj-filters">
                        <button class="tf-subj-btn active" data-subj="todas">Todas</button>
                        <button class="tf-subj-btn" data-subj="mat"  style="--sc:var(--mat)">Mat</button>
                        <button class="tf-subj-btn" data-subj="por"  style="--sc:var(--port)">Port</button>
                        <button class="tf-subj-btn" data-subj="bio"  style="--sc:var(--bio)">Bio</button>
                        <button class="tf-subj-btn" data-subj="qui"  style="--sc:var(--qui)">Qui</button>
                        <button class="tf-subj-btn" data-subj="fis"  style="--sc:var(--fis)">Fís</button>
                        <button class="tf-subj-btn" data-subj="his"  style="--sc:var(--hist)">His</button>
                    </div>
                </div>
                <div class="tf-controls-right">
                    <select class="form-input tf-sort" id="tf-sort">
                        <option value="prazo">Ordenar: Prazo</option>
                        <option value="prioridade">Ordenar: Prioridade</option>
                        <option value="materia">Ordenar: Matéria</option>
                    </select>
                    <button class="btn btn-primary tf-new-btn" id="tf-btn-new">+ Nova tarefa</button>
                </div>
            </div>

            <!-- Lista -->
            <div class="section">
                <div id="tf-list"></div>
            </div>
        </div>

        <!-- Modal nova tarefa -->
        <div class="modal-overlay" id="tf-modal" style="display:none;">
            <div class="modal-content">
                <div class="modal-title">Nova Tarefa</div>
                <div class="form-group">
                    <label class="form-label">Título da atividade</label>
                    <input type="text" id="tf-modal-title" class="form-input" placeholder="Ex: Exercícios de Gravitação">
                </div>
                <div class="form-group">
                    <label class="form-label">Descrição / observação</label>
                    <input type="text" id="tf-modal-desc" class="form-input" placeholder="Ex: pág. 45 · vence sexta">
                </div>
                <div class="tf-modal-row">
                    <div class="form-group">
                        <label class="form-label">Matéria</label>
                        <select id="tf-modal-subject" class="form-input">
                            <option value="mat">Matemática</option>
                            <option value="por">Português</option>
                            <option value="bio">Biologia</option>
                            <option value="qui">Química</option>
                            <option value="fis">Física</option>
                            <option value="his">História</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Prioridade</label>
                        <select id="tf-modal-priority" class="form-input">
                            <option value="baixa">Baixa</option>
                            <option value="media" selected>Média</option>
                            <option value="alta">Alta</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Prazo de entrega</label>
                    <input type="date" id="tf-modal-due" class="form-input">
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" id="tf-modal-cancel">Cancelar</button>
                    <button type="button" class="btn btn-primary"   id="tf-modal-confirm">Adicionar</button>
                </div>
            </div>
        </div>`;

        view.querySelector('#tf-status-filters').addEventListener('click', e => {
            const btn = e.target.closest('.tf-filter-btn');
            if (!btn) return;
            taskFilter = btn.dataset.filter;
            view.querySelectorAll('.tf-filter-btn').forEach(b => b.classList.toggle('active', b === btn));
            tarefasRender();
        });

        view.querySelector('#tf-subj-filters').addEventListener('click', e => {
            const btn = e.target.closest('.tf-subj-btn');
            if (!btn) return;
            taskSubjFilter = btn.dataset.subj;
            view.querySelectorAll('.tf-subj-btn').forEach(b => b.classList.toggle('active', b === btn));
            tarefasRender();
        });

        view.querySelector('#tf-sort').addEventListener('change', function() {
            taskSortBy = this.value;
            tarefasRender();
        });

        view.querySelector('#tf-btn-new').addEventListener('click', () => tarefasOpenModal());

        view.querySelector('#tf-modal-cancel').addEventListener('click', tarefasCloseModal);
        view.querySelector('#tf-modal').addEventListener('click', function(e) {
            if (e.target === this) tarefasCloseModal();
        });

        view.querySelector('#tf-modal-confirm').addEventListener('click', () => {
            const title = view.querySelector('#tf-modal-title').value.trim();
            if (!title) { view.querySelector('#tf-modal-title').focus(); return; }

            const desc     = view.querySelector('#tf-modal-desc').value.trim();
            const subject  = view.querySelector('#tf-modal-subject').value;
            const priority = view.querySelector('#tf-modal-priority').value;
            const due      = view.querySelector('#tf-modal-due').value || null;

            let descFinal = desc;
            if (!descFinal && due) {
                const d = new Date(due + 'T12:00:00');
                descFinal = 'Vence ' + d.toLocaleDateString('pt-BR', { weekday:'short', day:'2-digit', month:'short' });
            }
            if (!descFinal) descFinal = 'Adicionada agora';

            taskList.unshift({ id: nextTaskId++, title, desc: descFinal, subject, priority, done: false, due });

            taskFilter = 'todas';
            taskSubjFilter = 'todas';
            view.querySelectorAll('.tf-filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === 'todas'));
            view.querySelectorAll('.tf-subj-btn').forEach(b => b.classList.toggle('active', b.dataset.subj === 'todas'));

            tarefasCloseModal();
            tarefasRender();
        });

        tarefasRender();
    }

    // ─── CALENDÁRIO ESCOLAR ───
    const calGrid       = document.getElementById('school-calendar-grid');
    const calMonthLabel = document.getElementById('cal-month-label');

    if (calGrid) {
        const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
        let currentYear  = 2025;
        let currentMonth = 5;

        const schoolEvents = {
            '2025-5-23': [{ label:'Início Bimestre',    type:'event-geral'   }],
            '2025-5-24': [{ label:'Aula Redação',        type:'event-aula'    }],
            '2025-5-25': [{ label:'ENEM Lista Mat',      type:'event-prazo'   }, { label:'Redação M.U.', type:'event-prazo' }],
            '2025-5-26': [{ label:'Prova Matemática',    type:'event-prova'   }],
            '2025-5-27': [{ label:'Prazo Redação PR',    type:'event-prazo'   }],
            '2025-5-28': [{ label:'Feriado Municipal',   type:'event-feriado' }],
            '2025-6-1':  [{ label:'Simulado ENEM',       type:'event-prova'   }],
            '2025-6-8':  [{ label:'Física: Vetores',     type:'event-aula'    }],
            '2025-6-13': [{ label:'Recesso — Jul',       type:'event-recesso' }],
            '2025-6-14': [{ label:'Recesso Escolar',     type:'event-recesso' }],
        };

        function renderCalendar(year, month) {
            while (calGrid.children.length > 7) calGrid.removeChild(calGrid.lastChild);
            calMonthLabel.textContent = `${monthNames[month]} ${year}`;

            const firstDay    = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const offset      = (firstDay === 0) ? 6 : firstDay - 1;
            const today       = new Date();

            for (let i = 0; i < offset; i++) {
                const blank = document.createElement('div');
                blank.className = 'calendar-cell muted';
                blank.innerHTML = '<div class="cell-num"></div>';
                calGrid.appendChild(blank);
            }

            for (let d = 1; d <= daysInMonth; d++) {
                const cell    = document.createElement('div');
                const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
                cell.className = 'calendar-cell' + (isToday ? ' today-cell' : '');
                const key      = `${year}-${month}-${d}`;
                const events   = schoolEvents[key] || [];
                const evHtml   = events.map(ev => `<span class="cell-event ${ev.type}">${ev.label}</span>`).join('');
                cell.innerHTML = `<div class="cell-num">${d}</div><div class="cell-events">${evHtml}</div>`;
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
    const recipientBtns    = document.querySelectorAll('.recipient-btn');
    const turmaSelectGroup = document.getElementById('turma-select-group');
    if (recipientBtns.length > 0) {
        recipientBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                recipientBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if (turmaSelectGroup)
                    turmaSelectGroup.style.display = btn.dataset.target === 'turma' ? 'block' : 'none';
            });
        });
    }

    document.querySelectorAll('.turma-chip').forEach(chip => {
        chip.addEventListener('click', () => chip.classList.toggle('selected'));
    });

    document.querySelectorAll('.student-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.student-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.student-tab-content').forEach(c => c.style.display = 'none');
            const target = document.getElementById('tab-' + tab.dataset.tab);
            if (target) target.style.display = 'block';
        });
    });

    const profPublishBtn = document.getElementById('prof-publish-btn');
    if (profPublishBtn) {
        profPublishBtn.addEventListener('click', () => {
            const title    = document.getElementById('prof-task-title').value.trim();
            const subject  = document.getElementById('prof-task-subject').value;
            const due      = document.getElementById('prof-task-due').value;
            const platform = document.getElementById('prof-task-platform').value;
            if (!title) { alert('Informe o título da tarefa.'); return; }

            const list      = document.getElementById('prof-tasks-list');
            const tagMap    = { mat:'Mat', por:'Port', bio:'Bio', qui:'Qui', fis:'Fís', his:'His' };
            const dueText   = due ? new Date(due + 'T12:00:00').toLocaleDateString('pt-BR', { day:'2-digit', month:'short' }) : 'sem prazo';
            const plabels   = { interna:'Estuda CEEP', 'redacao-pr':'Redação Paraná', classroom:'Google Classroom', livro:'Livro Didático' };

            list.insertAdjacentHTML('afterbegin', `
                <div class="task-item">
                    <div class="task-body">
                        <div class="task-title">${title}</div>
                        <div class="task-meta">Publicada agora · Vence ${dueText} · 0 entregues · ${plabels[platform] || platform}</div>
                    </div>
                    <span class="task-tag tag-${subject}">${tagMap[subject]}</span>
                </div>`);

            document.getElementById('prof-task-title').value = '';
            document.getElementById('prof-task-desc').value  = '';
            document.getElementById('prof-task-due').value   = '';
            alert(`Tarefa "${title}" publicada com sucesso!`);
        });
    }

    document.querySelectorAll('.sync-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const original = this.textContent;
            this.textContent = 'Sincronizando...';
            this.disabled = true;
            setTimeout(() => {
                this.textContent = '✓ Atualizado';
                setTimeout(() => { this.textContent = original; this.disabled = false; }, 2000);
            }, 1200);
        });
    });
});