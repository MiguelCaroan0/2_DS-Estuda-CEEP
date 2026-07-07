document.addEventListener('DOMContentLoaded', () => {

    // ─── ÍCONES LUCIDE ───
    if (window.lucide) {
        lucide.createIcons();
    }

    // ─── SAUDAÇÃO DINÂMICA + RELÓGIO ───
    const weekdays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

    // Nome do usuário: preencha com o nome real (deixe vazio para não exibir).
    const STUDENT_NAME = '';

    function updateClock() {
        const now = new Date();
        const h = now.getHours();

        const greetingLabel = document.getElementById('greeting-label');
        const greetingSub = document.getElementById('greeting-sub');
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
        const heroDate = document.getElementById('hero-date');
        if (heroWeekday) heroWeekday.textContent = weekdays[now.getDay()];
        if (heroDate) heroDate.textContent = `${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`;

        const greetingNameEl = document.getElementById('greeting-name');
        if (greetingNameEl) greetingNameEl.textContent = STUDENT_NAME ? `${STUDENT_NAME}!` : '';

    }

    updateClock();
    setInterval(updateClock, 1000);

    // ─── GRADE DE HORÁRIOS SEMANAL (INÍCIO) ───
    // Cada aula tem: subject, name, time, content (conteúdo da aula)
    // Preencha os dias abaixo com as aulas reais do usuário.
    const timetable = {
        1: [], // Segunda
        2: [], // Terça
        3: [], // Quarta
        4: [], // Quinta
        5: [], // Sexta
        6: [], // Sábado
        0: [], // Domingo
    };


    function renderSubjectGrid(dayOfWeek) {
        const grid       = document.getElementById('inicio-subject-grid');
        const emptyState = document.getElementById('day-empty-state');
        if (!grid) return;

        const aulas = timetable[dayOfWeek] || [];
        grid.innerHTML = '';

        if (aulas.length === 0) {
            grid.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        grid.style.display = '';
        if (emptyState) emptyState.style.display = 'none';

        // Agrupa aulas consecutivas da mesma matéria para exibição em card único
        const groups = [];
        aulas.forEach(aula => {
            const last = groups[groups.length - 1];
            if (last && last.subject === aula.subject) {
                last.aulas.push(aula);
            } else {
                groups.push({ subject: aula.subject, name: aula.name, aulas: [aula] });
            }
        });

        groups.forEach(group => {
            const card = document.createElement('article');
            card.className = 'subject-card';
            card.dataset.subject = group.subject;

            const aulasHtml = group.aulas.map(a => `
                <div class="aula-item">
                    <span class="aula-time">${a.time}</span>
                    <span class="aula-content">${a.content}</span>
                </div>`).join('');

            card.innerHTML = `
                <div class="subject-tab"></div>
                <div class="subject-body">
                    <div class="subject-head">
                        <span class="subject-name">${group.name}</span>
                        <span class="aula-count">${group.aulas.length} aula${group.aulas.length > 1 ? 's' : ''}</span>
                    </div>
                    <div class="aulas-list">${aulasHtml}</div>
                </div>`;
            grid.appendChild(card);
        });
    }

    function renderDaysWeek() {
        const container = document.getElementById('inicio-days-week');
        if (!container) return;

        const now = new Date();
        const todayDow = now.getDay();
        const labels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const monday = new Date(now);
        monday.setDate(now.getDate() - ((todayDow + 6) % 7));

        container.innerHTML = '';
        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
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
                const dow = parseInt(d.dataset.dow);
                renderSubjectGrid(dow);
            });
        });

        renderSubjectGrid(todayDow);
    }

    renderDaysWeek();

    // ─── RESUMO RÁPIDO (cards do início) ───
    
    function updateInicioSummary() {
        const now = new Date();
        const todayDow = now.getDay();

        // — Card 1: Progresso do dia (aulas fixas + itens da agenda do aluno) —
        const circumference = 2 * Math.PI * 28;

        const arc = document.getElementById('home-day-arc');
        const pctEl = document.getElementById('home-day-pct');
        const fractionEl = document.getElementById('home-day-fraction');
        const subEl = document.getElementById('home-day-sub');

        // Aulas fixas da grade horária (timetable)
        const todayAulas = timetable[todayDow] || [];

        // Itens adicionados pelo aluno na agenda (exclui aulas fixas duplicadas)
        const dowToKeyMap = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
        const todayKeyMap = dowToKeyMap[todayDow];
        const agendaTodayItems = agendaSchedule[todayKeyMap] || [];
        // Pega apenas itens do aluno que NÃO são do tipo 'aula' (aulas fixas já estão no timetable)
        const agendaExtras = agendaTodayItems.filter(e => e.type !== 'aula' && e.subject);

        // Total combinado: aulas fixas + sessões extras do aluno
        const totalAulas = todayAulas.length + agendaExtras.length;

        // Estima quantas já ocorreram/foram concluídas com base na hora atual
        const nowH = now.getHours() + now.getMinutes() / 60;
        let aulasConcluidas = 0;

        // Aulas fixas: cada uma dura ~45min, verifica se já passou o horário de início + 45min
        todayAulas.forEach(a => {
            const startH = parseInt(a.time.split('h')[0]) + (a.time.includes('h1') ? 0.25 : 0);
            if (nowH > startH + 0.75) aulasConcluidas++;
        });

        // Sessões extras da agenda: cada uma dura ~60min
        agendaExtras.forEach(e => {
            const parts = e.time.split(':');
            const startH = parseInt(parts[0]) + (parseInt(parts[1] || 0) / 60);
            if (nowH > startH + 1.0) aulasConcluidas++;
        });

        const dayPct = totalAulas === 0 ? 0 : Math.round((aulasConcluidas / totalAulas) * 100);

        if (arc) {
            arc.style.strokeDasharray = circumference;
            arc.style.strokeDashoffset = circumference - (dayPct / 100) * circumference;
            arc.style.stroke = dayPct === 100 ? 'var(--bio)' : 'var(--qui)';
        }
        if (pctEl)      pctEl.textContent      = totalAulas === 0 ? '—' : dayPct + '%';
        if (fractionEl) fractionEl.textContent  = totalAulas === 0 ? '—' : `${aulasConcluidas}/${totalAulas}`;
        if (subEl) {
            if (totalAulas === 0) {
                subEl.textContent = 'sem aulas hoje';
            } else {
                const partes = [];
                if (todayAulas.length) partes.push(`${todayAulas.length} fix${todayAulas.length > 1 ? 'as' : 'a'}`);
                if (agendaExtras.length) partes.push(`${agendaExtras.length} extra${agendaExtras.length > 1 ? 's' : ''}`);
                subEl.textContent = partes.join(' + ') + ' concluídas';
            }
        }

        // — Card 2: Tarefas pendentes hoje —
        const todayStr = now.toISOString().slice(0, 10);
        const pendentes = taskList.filter(t => !t.done);
        const vencendoHoje = pendentes.filter(t => t.due === todayStr);
        const atrasadas = pendentes.filter(t => t.due && t.due < todayStr);

        const taskCountEl = document.getElementById('home-tasks-count');
        const taskSubEl   = document.getElementById('home-tasks-sub');
        const taskIcon    = document.getElementById('home-tasks-icon');

        if (taskCountEl) taskCountEl.textContent = pendentes.length;
        if (taskSubEl) {
            if (vencendoHoje.length > 0) {
                taskSubEl.textContent = `⚠️ ${vencendoHoje.length} vencem hoje!`;
                taskSubEl.className = 'summary-card-sub home-tasks-sub--urgent';
            } else if (atrasadas.length > 0) {
                taskSubEl.textContent = `${atrasadas.length} em atraso`;
                taskSubEl.className = 'summary-card-sub home-tasks-sub--urgent';
            } else {
                taskSubEl.textContent = 'a fazer';
                taskSubEl.className = 'summary-card-sub';
            }
        }
        if (taskIcon) {
            const urgent = vencendoHoje.length > 0 || atrasadas.length > 0;
            taskIcon.className = `summary-card-icon summary-card-icon--tasks${urgent ? ' urgent' : ''}`;
        }

        // — Card 4: Horas planejadas hoje —
        const dowToKey = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
        const todayKey = dowToKey[todayDow];
        const agendaToday = agendaSchedule[todayKey] || [];
        // Aulas fixas: conta as do timetable (cada uma = 45min)
        const aulaCount = todayAulas.length;
        // Sessões extras: itens da agenda que não são do tipo 'aula' (cada uma = 60min)
        const estudoSessions = agendaToday.filter(e => e.type !== 'aula' && e.subject);
        const estudoCount = estudoSessions.length;
        const totalMin = aulaCount * 45 + estudoCount * 60;
        const horas = Math.floor(totalMin / 60);
        const min = totalMin % 60;

        const hoursEl = document.getElementById('home-hours-value');
        const hoursSub = document.getElementById('home-hours-sub');
        if (hoursEl) {
            if (totalMin === 0) {
                hoursEl.textContent = '0h';
            } else {
                hoursEl.textContent = min > 0 ? `${horas}h${String(min).padStart(2,'0')}` : `${horas}h`;
            }
        }
        if (hoursSub) {
            const parts = [];
            if (aulaCount) parts.push(`${aulaCount} aulas`);
            if (estudoCount) parts.push(`${estudoCount} sessão${estudoCount > 1 ? 'es' : ''} extra`);
            hoursSub.textContent = parts.length ? parts.join(' + ') : 'nada agendado';
        }
    }

    // ─── SPA ROUTING ───
    const navItems = document.querySelectorAll('.nav-item');
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
            if (targetId === 'inicio' && (text.includes('início') || text.includes('inicio'))) item.classList.add('active');
            else if (targetId === 'agenda' && text.includes('agenda')) item.classList.add('active');
            else if (targetId === 'tarefas' && text.includes('tarefa')) item.classList.add('active');
            else if (targetId === 'historico' && (text.includes('histórico') || text.includes('historico'))) item.classList.add('active');
            else if (targetId === 'materias' && (text.includes('matéria') || text.includes('materia'))) item.classList.add('active');
            else if (targetId === 'calendario' && (text.includes('calendário') || text.includes('calendario'))) item.classList.add('active');
            else if (targetId === 'professor' && text.includes('professor')) item.classList.add('active');
        });

        if (targetId === 'agenda') initAgenda();
        if (targetId === 'tarefas') initTarefas();
        if (targetId === 'historico') initHistorico();
        if (targetId === 'materias' && window._matRenderGrid) window._matRenderGrid();
        window.scrollTo(0, 0);
    }

    navigateTo(window.location.hash);
    window.addEventListener('hashchange', () => navigateTo(window.location.hash));

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const text = item.textContent.trim().toLowerCase();
            let hash = '#inicio';
            if (text.includes('início') || text.includes('inicio')) hash = '#inicio';
            else if (text.includes('agenda')) hash = '#agenda';
            else if (text.includes('tarefa')) hash = '#tarefas';
            else if (text.includes('histórico') || text.includes('historico')) hash = '#historico';
            else if (text.includes('matéria') || text.includes('materia')) hash = '#materias';
            else if (text.includes('calendário') || text.includes('calendario')) hash = '#calendario';
            else if (text.includes('professor')) hash = '#professor';
            window.location.hash = hash;
        });
    });

    // ─── AGENDA DE ESTUDOS ───
    // Gera a semana atual (segunda a domingo) com base na data real de hoje,
    // em vez de uma semana fixa de exemplo.
    function buildCurrentAgendaWeek() {
        const dowKeys = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
        const dowLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const now = new Date();
        const monday = new Date(now);
        const diffToMonday = (now.getDay() + 6) % 7; // segunda = início da semana
        monday.setDate(now.getDate() - diffToMonday);

        const week = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            const dow = d.getDay();
            week.push({
                label: dowLabels[dow],
                num: String(d.getDate()),
                fullLabel: `${weekdays[dow]}, ${d.getDate()} ${months[d.getMonth()].slice(0, 3)}`,
                key: dowKeys[dow],
                dow: dow,
            });
        }
        // Reordena para sempre começar na segunda-feira
        const segIdx = week.findIndex(d => d.key === 'seg');
        return [...week.slice(segIdx), ...week.slice(0, segIdx)];
    }

    const AGENDA_DAYS = buildCurrentAgendaWeek();

    const AGENDA_SUBJECTS = {
        mat: { name: 'Matemática', tag: 'Mat', cssVar: '--mat' },
        por: { name: 'Português', tag: 'Port', cssVar: '--port' },
        bio: { name: 'Front-End', tag: 'FE', cssVar: '--bio' },
        qui: { name: 'Back-End', tag: 'BE', cssVar: '--qui' },
        fis: { name: 'Física', tag: 'Fís', cssVar: '--fis' },
        his: { name: 'História', tag: 'His', cssVar: '--hist' },
    };

    const AGENDA_HOURS = [
        '07:15', '08:00', '09:00', '10:00', '11:00', '12:30',
        '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
    ];

    const AI_PLAN = {
        seg: [],
        ter: [],
        qua: [],
        qui: [],
        sex: [],
        sab: [], dom: [],
    };

    // Horário de aula fixo (07:15–12:30, seg a sex) — agora faz parte do próprio
    // plano de estudos em vez de uma visão separada de "horário escolar".
    const FIXED_SCHOOL = {
        seg: [
            { time: '07:15', title: 'Horário de aula', type: 'aula' },
            { time: '08:00', title: 'Horário de aula', type: 'aula' },
            { time: '09:00', title: 'Horário de aula', type: 'aula' },
            { time: '10:00', title: 'Horário de aula', type: 'aula' },
            { time: '11:00', title: 'Horário de aula', type: 'aula' },
            { time: '12:30', title: 'Horário de aula', type: 'aula' },
        ],
        ter: [
            { time: '07:15', title: 'Horário de aula', type: 'aula' },
            { time: '08:00', title: 'Horário de aula', type: 'aula' },
            { time: '09:00', title: 'Horário de aula', type: 'aula' },
            { time: '10:00', title: 'Horário de aula', type: 'aula' },
            { time: '11:00', title: 'Horário de aula', type: 'aula' },
            { time: '12:30', title: 'Horário de aula', type: 'aula' },
        ],
        qua: [
            { time: '07:15', title: 'Horário de aula', type: 'aula' },
            { time: '08:00', title: 'Horário de aula', type: 'aula' },
            { time: '09:00', title: 'Horário de aula', type: 'aula' },
            { time: '10:00', title: 'Horário de aula', type: 'aula' },
            { time: '11:00', title: 'Horário de aula', type: 'aula'},
            { time: '12:30', title: 'Horário de aula', type: 'aula'},
        ],
        qui: [
            { time: '07:15', title: 'Horário de aula', type: 'aula'},
            { time: '08:00', title: 'Horário de aula', type: 'aula'},
            { time: '09:00', title: 'Horário de aula', type: 'aula'},
            { time: '10:00', title: 'Horário de aula', type: 'aula'},
            { time: '11:00', title: 'Horário de aula', type: 'aula'},
            { time: '12:30', title: 'Horário de aula', type: 'aula'},
        ],
        sex: [
            { time: '07:15', title: 'Horário de aula', type: 'aula'},
            { time: '08:00', title: 'Horário de aula', type: 'aula'},
            { time: '09:00', title: 'Horário de aula', type: 'aula'},
            { time: '10:00', title: 'Horário de aula', type: 'aula'},
            { time: '11:00', title: 'Horário de aula', type: 'aula'},
            { time: '12:30', title: 'Horário de aula', type: 'aula'},
        ],
        sab: [], dom: [],
    };

    function agendaCloneFixedSchool() {
        const out = {};
        Object.keys(FIXED_SCHOOL).forEach(k => {
            out[k] = FIXED_SCHOOL[k].map(e => ({ ...e }));
        });
        return out;
    }

    let agendaSchedule = agendaCloneFixedSchool();
    let agendaActiveDay = AGENDA_DAYS.find(d => d.dow === new Date().getDay())?.key || AGENDA_DAYS[0].key;
    let agendaInitialized = false;

    function agendaApplyAIPlan() {
        Object.keys(AI_PLAN).forEach(k => {
            const fixed = (FIXED_SCHOOL[k] || []).map(e => ({ ...e }));
            const suggested = AI_PLAN[k].map(e => ({ ...e }));
            agendaSchedule[k] = [...fixed, ...suggested].sort((a, b) => a.time.localeCompare(b.time));
        });
        agendaUpdateSummary();
        agendaRenderPlanner();
    }

    function agendaNavigateDay(direction) {
        const keys = AGENDA_DAYS.map(d => d.key);
        const idx = keys.indexOf(agendaActiveDay);
        const newIdx = (idx + direction + keys.length) % keys.length;
        agendaActiveDay = keys[newIdx];
        agendaRenderPlanner();
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
                    <div class="day-empty-title">Fim de semana livre</div>
                    <div class="day-empty-sub">Aproveite para descansar ou revisar o que estudou!</div>
                </div>`;
            return;
        }

        const source = agendaSchedule[agendaActiveDay] || [];

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
                const isSchool = ev.school || ev.type === 'aula';
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
                            <div class="agenda-event-meta">${h} · ${isIntervalo ? 'Pausa' : (subjInfo ? subjInfo.name : 'Aula')}${schoolBadge}</div>
                        </div>
                        ${tagHtml}
                    </div>`;

                if (!isSchool) {
                    slot.title = 'Duplo clique para remover';
                    slot.addEventListener('dblclick', () => {
                        agendaSchedule[agendaActiveDay] = agendaSchedule[agendaActiveDay].filter(x => x.time !== h);
                        agendaUpdateSummary();
                        agendaRenderPlanner();
                    });
                }
            } else {
                const hNum = parseInt(h.split(':')[0]);
                if (hNum >= 13) {
                    slot.classList.add('agenda-slot--empty');
                    slot.innerHTML = `<span class="agenda-slot-hint">+ adicionar</span>`;
                    slot.addEventListener('click', () => {
                        const sel = document.getElementById('agenda-modal-time');
                        if (sel) sel.value = h;
                        agendaOpenModal();
                    });
                } else {
                    slot.classList.add('agenda-slot--blocked');
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
        // Conta apenas sessões extras adicionadas pelo aluno (ignora aulas fixas)
        let totalExtras = 0;
        Object.values(agendaSchedule).forEach(day => {
            day.forEach(e => {
                if (e.subject && e.type !== 'aula') totalExtras++;
            });
        });

        // Horas: cada sessão extra = 60min
        const totalMin = totalExtras * 60;
        const horas = Math.floor(totalMin / 60);
        const min = totalMin % 60;
        const horasStr = totalMin === 0 ? '0h' : (min > 0 ? `${horas}h${String(min).padStart(2,'0')}` : `${horas}h`);

        // Meta: baseada em extras sobre 15 sessões
        const META = 15;
        const metaPct = Math.min(100, Math.round(totalExtras / META * 100));
        const circumference = 2 * Math.PI * 28;

        const elAulas    = document.getElementById('agenda-sum-aulas');
        const elAulasSub = document.getElementById('agenda-sum-aulas-sub');
        const elHoras    = document.getElementById('agenda-sum-horas');
        const elMeta     = document.getElementById('agenda-sum-meta');
        const elMetaVal  = document.getElementById('agenda-sum-meta-val');
        const arc        = document.getElementById('agenda-meta-arc');

        if (elHoras)    elHoras.textContent    = horasStr;
        if (elAulas)    elAulas.textContent    = totalExtras;
        if (elAulasSub) elAulasSub.textContent = totalExtras === 0 ? 'nenhuma extra agendada' : 'sessões extras esta semana';
        if (elMeta)     elMeta.textContent     = metaPct + '%';
        if (elMetaVal)  elMetaVal.textContent  = `${totalExtras}/${META}`;
        if (arc) {
            arc.style.strokeDasharray  = circumference;
            arc.style.strokeDashoffset = circumference - (metaPct / 100) * circumference;
            arc.style.stroke = metaPct >= 100 ? 'var(--bio)' : 'var(--mat)';
        }

        // Atualiza o card de progresso do dia na aba Início
        updateInicioSummary();
    }

    function agendaOpenModal() {
        openModal('agenda-modal');
    }

    function agendaCloseModal() {
        closeModal('agenda-modal');
    }

    function initAgenda() {
        if (agendaInitialized) {
            agendaRenderPlanner();
            agendaUpdateSummary();
            return;
        }
        agendaInitialized = true;

        const view = document.getElementById('view-agenda');
        if (!view) return;

        // Populate o select apenas com horários a partir das 13h (extras do aluno)
        const timeSelect = document.getElementById('agenda-modal-time');
        if (timeSelect) {
            const horasExtras = AGENDA_HOURS.filter(h => parseInt(h.split(':')[0]) >= 13);
            timeSelect.innerHTML = horasExtras.map(h => `<option value="${h}">${h}</option>`).join('');
        }

        const navPrev = document.getElementById('agenda-nav-prev');
        const navNext = document.getElementById('agenda-nav-next');
        if (navPrev) navPrev.addEventListener('click', () => agendaNavigateDay(-1));
        if (navNext) navNext.addEventListener('click', () => agendaNavigateDay(1));

        document.getElementById('agenda-btn-apply').addEventListener('click', agendaApplyAIPlan);
        document.getElementById('agenda-btn-apply-banner').addEventListener('click', agendaApplyAIPlan);

        document.getElementById('agenda-btn-clear').addEventListener('click', () => {
            agendaSchedule[agendaActiveDay] = agendaSchedule[agendaActiveDay].filter(e => e.type === 'aula');
            agendaUpdateSummary();
            agendaRenderPlanner();
        });

        document.getElementById('agenda-btn-add').addEventListener('click', agendaOpenModal);

        document.getElementById('agenda-modal-cancel').addEventListener('click', agendaCloseModal);

        document.getElementById('agenda-modal').addEventListener('click', function (e) {
            if (e.target === this) agendaCloseModal();
        });

        document.getElementById('agenda-modal-confirm').addEventListener('click', () => {
            const subj = document.getElementById('agenda-modal-subject').value;
            const title = document.getElementById('agenda-modal-title').value.trim()
                || AGENDA_SUBJECTS[subj].name;
            const time = document.getElementById('agenda-modal-time').value;

            const day = agendaSchedule[agendaActiveDay];
            const idx = day.findIndex(e => e.time === time);
            if (idx > -1) day.splice(idx, 1);
            day.push({ time, subject: subj, title });
            day.sort((a, b) => a.time.localeCompare(b.time));

            document.getElementById('agenda-modal-title').value = '';
            agendaCloseModal();
            agendaUpdateSummary();
            agendaRenderPlanner();
        });

        agendaApplyAIPlan();
    }

    // ─── TAREFAS (REDESENHADO) ───────────────────────────────────────────────

    const TASK_SUBJECTS = {
        mat: { name: 'Matemática', tag: 'Mat', color: 'var(--mat)', bg: 'rgba(255,138,91,0.15)' },
        por: { name: 'Português', tag: 'Port', color: 'var(--port)', bg: 'rgba(95,179,232,0.15)' },
        bio: { name: 'Front-End', tag: 'FE', color: 'var(--bio)', bg: 'rgba(111,207,122,0.15)' },
        qui: { name: 'Back-End', tag: 'BE', color: 'var(--qui)', bg: 'rgba(255,209,102,0.15)' },
        fis: { name: 'Física', tag: 'Fís', color: 'var(--fis)', bg: 'rgba(255,107,157,0.15)' },
        his: { name: 'História', tag: 'His', color: 'var(--hist)', bg: 'rgba(199,146,234,0.15)' },
    };

    const PRIO_COLOR = { alta: 'var(--fis)', media: 'var(--qui)', baixa: 'var(--bio)' };
    const PRIO_LABEL = { alta: 'Alta', media: 'Média', baixa: 'Baixa' };
    const PRIO_ORDER = { alta: 0, media: 1, baixa: 2 };

    let taskList = [];
    let nextTaskId = 1;
    let taskFilter = 'pendentes';
    let taskSubjFilter = 'todas';
    let taskSortBy = 'prazo';
    let tarefasInitialized = false;

    // Agora sim: taskList e agendaSchedule já existem, então é seguro chamar.
    updateInicioSummary();

    const TODAY_DATE = new Date().toISOString().slice(0, 10);

    function taskDueClass(t) {
        if (t.done || !t.due) return '';
        if (t.due < TODAY_DATE) return 'tf-due-late';
        if (t.due === TODAY_DATE) return 'tf-due-today';
        return '';
    }

    function taskGetFiltered() {
        let list = [...taskList];
        if (taskFilter === 'pendentes') list = list.filter(t => !t.done);
        if (taskFilter === 'concluidas') list = list.filter(t => t.done);
        if (taskSubjFilter !== 'todas') list = list.filter(t => t.subject === taskSubjFilter);

        list.sort((a, b) => {
            if (taskSortBy === 'prioridade') return PRIO_ORDER[a.priority] - PRIO_ORDER[b.priority];
            if (taskSortBy === 'materia') return a.subject.localeCompare(b.subject);
            return (a.due || '9999').localeCompare(b.due || '9999');
        });
        return list;
    }

    function taskToggleDone(id) {
        const t = taskList.find(t => t.id === id);
        if (t) t.done = !t.done;
        tarefasRender();
        updateInicioSummary();
    }

    function taskDelete(id) {
        taskList = taskList.filter(t => t.id !== id);
        tarefasRender();
    }

    function taskCardHTML(t) {
        const s = TASK_SUBJECTS[t.subject] || { name: t.subject, tag: t.subject, color: 'var(--borda-cinza)', bg: 'transparent' };
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

        const pend = taskList.filter(t => !t.done);
        const conc = taskList.filter(t => t.done);
        const hoje = pend.filter(t => t.due === TODAY_DATE).length;
        const atras = pend.filter(t => t.due && t.due < TODAY_DATE).length;
        const total = taskList.length;
        const pct = total === 0 ? 0 : Math.round((conc.length / total) * 100);

        const badge = view.querySelector('.tf-badge');
        if (badge) badge.textContent = `${pend.length} PENDENTES`;

        const sPend = view.querySelector('#tf-stat-pend');
        const sConc = view.querySelector('#tf-stat-conc');
        const sHoje = view.querySelector('#tf-stat-hoje');
        const sAtras = view.querySelector('#tf-stat-atras');
        const bar = view.querySelector('#tf-progress-bar');
        const pctEl = view.querySelector('#tf-progress-pct');

        if (sPend) sPend.textContent = pend.length;
        if (sConc) sConc.textContent = conc.length;
        if (sHoje) sHoje.textContent = hoje;
        if (sAtras) sAtras.textContent = atras;
        if (bar) bar.style.width = pct + '%';
        if (pctEl) pctEl.textContent = pct + '%';

        const listEl = view.querySelector('#tf-list');
        if (!listEl) return;

        const filtered = taskGetFiltered();

        if (!filtered.length) {
            listEl.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-title">Nenhuma tarefa aqui</div>
                    <div class="empty-state-sub">Tudo em ordem por este filtro!</div>
                </div>`;
            return;
        }

        if (taskSubjFilter === 'todas') {
            const pList = filtered.filter(t => !t.done);
            const cList = filtered.filter(t => t.done);
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
        m.querySelector('#tf-modal-title').value = prefill?.title || '';
        m.querySelector('#tf-modal-desc').value = prefill?.desc || '';
        m.querySelector('#tf-modal-subject').value = prefill?.subject || 'mat';
        m.querySelector('#tf-modal-priority').value = prefill?.priority || 'media';
        m.querySelector('#tf-modal-due').value = prefill?.due || '';
        openModal('tf-modal');
        setTimeout(() => m.querySelector('#tf-modal-title').focus(), 50);
    }

    function tarefasCloseModal() {
        closeModal('tf-modal');
    }

    function initTarefas() {
        if (tarefasInitialized) { tarefasRender(); return; }
        tarefasInitialized = true;

        const view = document.getElementById('view-tarefas');
        if (!view) return;

        view.querySelector('#tf-status-filters').addEventListener('click', e => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;
            taskFilter = btn.dataset.filter;
            view.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
            tarefasRender();
        });

        view.querySelector('#tf-subj-filters').addEventListener('click', e => {
            const btn = e.target.closest('.tf-subj-btn');
            if (!btn) return;
            taskSubjFilter = btn.dataset.subj;
            view.querySelectorAll('.tf-subj-btn').forEach(b => b.classList.toggle('active', b === btn));
            tarefasRender();
        });

        view.querySelector('#tf-sort').addEventListener('change', function () {
            taskSortBy = this.value;
            tarefasRender();
        });

        view.querySelector('#tf-btn-new').addEventListener('click', () => tarefasOpenModal());

        view.querySelector('#tf-modal-cancel').addEventListener('click', tarefasCloseModal);
        view.querySelector('#tf-modal').addEventListener('click', function (e) {
            if (e.target === this) tarefasCloseModal();
        });

        view.querySelector('#tf-modal-confirm').addEventListener('click', () => {
            const title = view.querySelector('#tf-modal-title').value.trim();
            if (!title) { view.querySelector('#tf-modal-title').focus(); return; }

            const desc = view.querySelector('#tf-modal-desc').value.trim();
            const subject = view.querySelector('#tf-modal-subject').value;
            const priority = view.querySelector('#tf-modal-priority').value;
            const due = view.querySelector('#tf-modal-due').value || null;

            let descFinal = desc;
            if (!descFinal && due) {
                const d = new Date(due + 'T12:00:00');
                descFinal = 'Vence ' + d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
            }
            if (!descFinal) descFinal = 'Adicionada agora';

            taskList.unshift({ id: nextTaskId++, title, desc: descFinal, subject, priority, done: false, due });

            taskFilter = 'pendentes';
            taskSubjFilter = 'todas';
            view.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === 'pendentes'));
            view.querySelectorAll('.tf-subj-btn').forEach(b => b.classList.toggle('active', b.dataset.subj === 'todas'));

            tarefasCloseModal();
            tarefasRender();
        });

        tarefasRender();
    }

    // ─── HISTÓRICO ───
    const HIST_SUBJECTS = {
        mat: { name: 'Matemática', tag: 'Mat', color: 'var(--mat)', cssClass: 'tag-mat' },
        por: { name: 'Português',  tag: 'Port', color: 'var(--port)', cssClass: 'tag-por' },
        bio: { name: 'Front-End',   tag: 'FE',  color: 'var(--bio)',  cssClass: 'tag-bio' },
        qui: { name: 'Back-End',    tag: 'BE',  color: 'var(--qui)',  cssClass: 'tag-qui' },
        fis: { name: 'Física',     tag: 'Fís',  color: 'var(--fis)',  cssClass: 'tag-fis' },
        his: { name: 'História',   tag: 'His',  color: 'var(--hist)', cssClass: 'tag-his' },
    };

    // Data: horas por matéria por dia (semana) — sem dados até haver registros reais
    const HIST_DATA_SEMANA = [
        { label: 'Seg', today: false, subjects: { mat: 0, por: 0, bio: 0, qui: 0, fis: 0, his: 0 } },
        { label: 'Ter', today: false, subjects: { mat: 0, por: 0, bio: 0, qui: 0, fis: 0, his: 0 } },
        { label: 'Qua', today: false, subjects: { mat: 0, por: 0, bio: 0, qui: 0, fis: 0, his: 0 } },
        { label: 'Qui', today: false, subjects: { mat: 0, por: 0, bio: 0, qui: 0, fis: 0, his: 0 } },
        { label: 'Hoje', today: true, subjects: { mat: 0, por: 0, bio: 0, qui: 0, fis: 0, his: 0 } },
        { label: 'Sáb', today: false, subjects: { mat: 0, por: 0, bio: 0, qui: 0, fis: 0, his: 0 } },
        { label: 'Dom', today: false,  subjects: { mat: 0, por: 0, bio: 0, qui: 0, fis: 0, his: 0 } },
    ];

    // Data: horas por matéria por semana (mês) — sem dados até haver registros reais
    const HIST_DATA_MES = [
        { label: 'S1', today: false, subjects: { mat: 0, por: 0, bio: 0, qui: 0, fis: 0, his: 0 } },
        { label: 'S2', today: false, subjects: { mat: 0, por: 0, bio: 0, qui: 0, fis: 0, his: 0 } },
        { label: 'S3', today: false, subjects: { mat: 0, por: 0, bio: 0, qui: 0, fis: 0, his: 0 } },
        { label: 'S4', today: true,  subjects: { mat: 0, por: 0, bio: 0, qui: 0, fis: 0, his: 0 } },
    ];

    // Sessões recentes — sem dados de exemplo, populado a partir de registros reais
    const HIST_SESSIONS = [];

    let histPeriod = 'semana';
    let histSubjFilter = 'todas';
    let histSearchQuery = '';

    function histRenderChart() {
        const data = histPeriod === 'semana' ? HIST_DATA_SEMANA : HIST_DATA_MES;
        const barsRow = document.getElementById('hist-bars-row');
        const xLabels = document.getElementById('hist-x-labels');
        const yAxis = document.getElementById('hist-y-axis');
        const tooltip = document.getElementById('hist-tooltip');
        if (!barsRow) return;

        // Find max total
        let maxTotal = 0;
        data.forEach(d => {
            const total = Object.values(d.subjects).reduce((a, b) => a + b, 0);
            if (total > maxTotal) maxTotal = total;
        });
        maxTotal = Math.ceil(maxTotal) || 4;

        // Y axis labels (0, 25%, 50%, 75%, 100%)
        yAxis.innerHTML = '';
        for (let i = 0; i <= 4; i++) {
            const val = (maxTotal * i / 4);
            const lbl = document.createElement('div');
            lbl.className = 'hist-y-label';
            lbl.textContent = val % 1 === 0 ? val + 'h' : val.toFixed(1) + 'h';
            yAxis.appendChild(lbl);
        }

        barsRow.innerHTML = '';
        xLabels.innerHTML = '';

        const subjOrder = ['his', 'fis', 'qui', 'bio', 'por', 'mat'];

        data.forEach((d, di) => {
            const total = Object.values(d.subjects).reduce((a, b) => a + b, 0);
            const pct = maxTotal > 0 ? (total / maxTotal) * 100 : 0;

            const group = document.createElement('div');
            group.className = 'hist-bar-group';

            // Single solid bar — neutral color, highlight on hover
            const bar = document.createElement('div');
            bar.className = 'hist-bar-solid' + (d.today ? ' hist-bar-today' : '');
            bar.style.height = pct + '%';

            group.appendChild(bar);
            barsRow.appendChild(group);

            // Tooltip: show per-subject breakdown with colors
            group.addEventListener('mouseenter', () => {
                bar.classList.add('hist-bar-hovered');

                const rect = group.getBoundingClientRect();
                const cardRect = document.querySelector('.hist-chart-card').getBoundingClientRect();

                let html = `<div class="hist-tooltip-day">${d.label}${d.today ? ' · Hoje' : ''}</div>`;
                subjOrder.slice().reverse().forEach(sk => {
                    const h = d.subjects[sk] || 0;
                    if (h <= 0) return;
                    const pctSubj = total > 0 ? Math.round((h / total) * 100) : 0;
                    html += `<div class="hist-tooltip-row">
                        <span style="flex:1">${HIST_SUBJECTS[sk].name}</span>
                        <span style="color:var(--borda-cinza);font-size:10px;margin-right:4px">${pctSubj}%</span>
                        <span style="font-weight:700">${h.toFixed(1)}h</span>
                    </div>`;
                });
                html += `<div class="hist-tooltip-total">Total: ${total.toFixed(1)}h</div>`;
                tooltip.innerHTML = html;

                let left = rect.left - cardRect.left + rect.width / 2;
                let top = rect.top - cardRect.top - tooltip.offsetHeight - 8;

                const ttW = 168;
                if (left + ttW / 2 > cardRect.width - 16) left = cardRect.width - ttW - 16;
                if (left - ttW / 2 < 16) left = 16 + ttW / 2;

                tooltip.style.left = (left - ttW / 2) + 'px';
                tooltip.style.top = (top < 0 ? rect.bottom - cardRect.top + 8 : top) + 'px';
                tooltip.style.display = 'block';
            });

            group.addEventListener('mouseleave', () => {
                bar.classList.remove('hist-bar-hovered');
                tooltip.style.display = 'none';
            });

            // X label
            const lbl = document.createElement('div');
            lbl.className = 'hist-x-label' + (d.today ? ' today-label' : '');
            lbl.textContent = d.label;
            xLabels.appendChild(lbl);
        });
    }

    function histRenderSessions() {
        const list = document.getElementById('hist-sessions-list');
        const empty = document.getElementById('hist-empty');
        const countEl = document.getElementById('hist-session-count');
        if (!list) return;

        const filtered = HIST_SESSIONS.filter(s => {
            const matchSubj = histSubjFilter === 'todas' || s.subject === histSubjFilter;
            const q = histSearchQuery.toLowerCase();
            const matchSearch = !q || s.title.toLowerCase().includes(q) || s.meta.toLowerCase().includes(q) || HIST_SUBJECTS[s.subject].name.toLowerCase().includes(q);
            return matchSubj && matchSearch;
        });

        list.innerHTML = '';

        if (filtered.length === 0) {
            list.style.display = 'none';
            empty.style.display = 'block';
            if (countEl) countEl.textContent = '0 sessões';
            return;
        }

        list.style.display = '';
        empty.style.display = 'none';
        if (countEl) countEl.textContent = `${filtered.length} sessão${filtered.length !== 1 ? 'ões' : ''}`;

        filtered.forEach(s => {
            const subj = HIST_SUBJECTS[s.subject];
            const item = document.createElement('div');
            item.className = 'task-item done';
            item.innerHTML = `
                <div class="task-body">
                    <div>
                        <div class="task-title">${s.title}</div>
                        <div class="task-meta">${s.meta}</div>
                    </div>
                    <span class="task-tag ${subj.cssClass}">${subj.tag}</span>
                </div>`;
            list.appendChild(item);
        });
    }

    function initHistorico() {
        // Period buttons
        document.querySelectorAll('.hist-period-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.hist-period-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                histPeriod = btn.dataset.period;
                histRenderChart();
            });
        });

        // Subject filter chips
        const subjFilters = document.getElementById('hist-subj-filters');
        if (subjFilters) {
            subjFilters.querySelectorAll('.tf-subj-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    subjFilters.querySelectorAll('.tf-subj-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    histSubjFilter = btn.dataset.subj;
                    histRenderSessions();
                });
            });
        }

        // Search input
        const searchInput = document.getElementById('hist-search');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                histSearchQuery = searchInput.value;
                histRenderSessions();
            });
        }

        histRenderChart();
        histRenderSessions();
    }

    // ─── CALENDÁRIO ESCOLAR ───
    const calGrid = document.getElementById('school-calendar-grid');
    const calMonthLabel = document.getElementById('cal-month-label');

    if (calGrid) {
        const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        const weekdayNames = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
        const today = new Date();
        let currentYear = today.getFullYear();
        let currentMonth = today.getMonth();
        let activeCalFilter = 'todas';

        const typeLabels = {
            'event-prova':   'Prova',
            'event-prazo':   'Prazo',
            'event-feriado': 'Feriado',
            'event-recesso': 'Recesso',
            'event-evento':  'Evento',
            'event-aula':    'Aula',
        };

        const schoolEvents = {};

        function eventMatchesFilter(type) {
            if (activeCalFilter === 'todas') return true;
            return activeCalFilter.split(' ').includes(type);
        }

        // ── Modal ──
        const dayModal       = document.getElementById('cal-day-modal');
        const modalTitle     = document.getElementById('cal-day-modal-title');
        const modalSub       = document.getElementById('cal-day-modal-sub');
        const modalBody      = document.getElementById('cal-day-modal-body');
        const modalClose     = document.getElementById('cal-day-modal-close');

        function openDayModal(year, month, day, events) {
            const date = new Date(year, month, day);
            const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
            const dayName = weekdayNames[date.getDay()];
            const dayName2 = dayName.charAt(0).toUpperCase() + dayName.slice(1);
            modalTitle.textContent = `${day} de ${monthNames[month]} de ${year}`;
            modalSub.textContent   = isToday ? `${dayName2} · Hoje` : dayName2;

            if (events.length === 0) {
                modalBody.innerHTML = `<div class="cal-day-modal-empty">Nenhum evento neste dia.</div>`;
            } else {
                modalBody.innerHTML = events.map(ev => `
                    <div class="cal-day-modal-event ${ev.type}">
                        <span class="cal-day-modal-event-type">${typeLabels[ev.type] || 'Evento'}</span>
                        <span class="cal-day-modal-event-label">${ev.label}</span>
                    </div>`).join('');
            }

            dayModal.style.display = 'flex';
            requestAnimationFrame(() => dayModal.classList.add('open'));
        }

        function closeDayModal() {
            dayModal.classList.remove('open');
            setTimeout(() => { dayModal.style.display = 'none'; }, 220);
        }

        if (modalClose) modalClose.addEventListener('click', closeDayModal);
        if (dayModal)   dayModal.addEventListener('click', e => { if (e.target === dayModal) closeDayModal(); });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && dayModal && dayModal.style.display !== 'none') closeDayModal();
        });

        function renderCalendar(year, month) {
            while (calGrid.children.length > 7) calGrid.removeChild(calGrid.lastChild);
            calMonthLabel.textContent = `${monthNames[month]} ${year}`;

            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const offset = (firstDay === 0) ? 6 : firstDay - 1;

            for (let i = 0; i < offset; i++) {
                const blank = document.createElement('div');
                blank.className = 'calendar-cell muted';
                blank.innerHTML = '<div class="cell-num"></div>';
                calGrid.appendChild(blank);
            }

            for (let d = 1; d <= daysInMonth; d++) {
                const cell = document.createElement('div');
                const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
                const key = `${year}-${month}-${d}`;
                const allEvents = schoolEvents[key] || [];

                const visibleEvents = activeCalFilter === 'todas'
                    ? allEvents
                    : allEvents.filter(ev => eventMatchesFilter(ev.type));

                const hasMatch = visibleEvents.length > 0;
                const dimmed   = activeCalFilter !== 'todas' && !hasMatch && !isToday;

                cell.className = 'calendar-cell'
                    + (isToday ? ' today-cell' : '')
                    + (dimmed  ? ' cal-dimmed'  : '')
                    + (allEvents.length > 0 ? ' has-events' : '');

                // Show max 2 event pills; if more, show +N badge
                const MAX_SHOW = 2;
                const shownEvents  = visibleEvents.slice(0, MAX_SHOW);
                const extraCount   = visibleEvents.length - MAX_SHOW;

                const evHtml = shownEvents
                    .map(ev => `<span class="cell-event ${ev.type}">${ev.label}</span>`)
                    .join('');

                const extraBadge = extraCount > 0
                    ? `<span class="cell-extra-badge">+${extraCount}</span>`
                    : '';

                const todayBadge = isToday
                    ? `<span class="today-badge">Hoje</span><span class="today-pulse-ring"></span>`
                    : '';

                cell.innerHTML = `
                    <div class="cell-top-row">
                        <div class="cell-num${isToday ? ' cell-num-today' : ''}">${d}${todayBadge}</div>
                    </div>
                    <div class="cell-events">${evHtml}${extraBadge}</div>`;

                // Click → open modal with ALL events for that day
                cell.addEventListener('click', () => openDayModal(year, month, d, allEvents));
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

        const filterBar = document.getElementById('cal-filter-bar');
        if (filterBar) {
            filterBar.querySelectorAll('.cal-filter-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBar.querySelectorAll('.cal-filter-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    activeCalFilter = btn.dataset.cat;
                    renderCalendar(currentYear, currentMonth);
                });
            });
        }
    }

    // ─── TOAST SYSTEM ───
    function showToast(message, type = 'success', duration = 3500) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;

        const icons = { success: '✓', error: '✕', info: 'ℹ', warn: '⚠' };
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.success}</span>
            <span class="toast-msg">${message}</span>
            <button class="toast-close" aria-label="Fechar">✕</button>`;

        container.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('toast--show'));

        const dismiss = () => {
            toast.classList.remove('toast--show');
            toast.addEventListener('transitionend', () => toast.remove(), { once: true });
        };

        toast.querySelector('.toast-close').addEventListener('click', dismiss);
        setTimeout(dismiss, duration);
    }

    // ─── GENERIC MODAL SYSTEM ───
    function openModal(id) {
        const m = document.getElementById(id);
        if (!m) return;
        m.style.display = 'flex';
        requestAnimationFrame(() => m.classList.add('open'));
    }

    function closeModal(id) {
        const m = document.getElementById(id);
        if (!m) return;
        m.classList.remove('open');
        m.addEventListener('transitionend', () => { m.style.display = 'none'; }, { once: true });
    }

    // Close buttons inside modals (data-close attribute)
    document.addEventListener('click', e => {
        const closeBtn = e.target.closest('[data-close]');
        if (closeBtn) { closeModal(closeBtn.dataset.close); return; }

        // Click on overlay background
        if (e.target.classList.contains('modal-overlay')) {
            closeModal(e.target.id);
        }
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
        }
    });

    // Stat cards open their modals
    document.querySelectorAll('.stat-card--clickable[data-modal]').forEach(card => {
        card.addEventListener('click', () => openModal(card.dataset.modal));
    });

    // Modal: Tarefas Ativas → "Nova Tarefa" rola até o form
    const modalTaNova = document.getElementById('modal-ta-nova-btn');
    if (modalTaNova) {
        modalTaNova.addEventListener('click', () => {
            closeModal('modal-tarefas-ativas');
            setTimeout(() => {
                const profTitle = document.getElementById('prof-task-title');
                if (profTitle) {
                    profTitle.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    profTitle.focus();
                }
            }, 300);
        });
    }

    // Modal: Não Realizadas → "Enviar lembrete"
    const modalNrNotificar = document.getElementById('modal-nr-notificar-btn');
    if (modalNrNotificar) {
        modalNrNotificar.addEventListener('click', () => {
            closeModal('modal-nao-realizadas');
            setTimeout(() => showToast('Nenhum aluno com pendências para notificar.', 'info'), 300);
        });
    }

    // ─── ÁREA DO PROFESSOR ───
    const recipientBtns = document.querySelectorAll('.recipient-btn');
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

    const profPublishBtn = document.getElementById('prof-publish-btn');
    if (profPublishBtn) {
        profPublishBtn.addEventListener('click', () => {
            const title = document.getElementById('prof-task-title').value.trim();
            const subject = document.getElementById('prof-task-subject').value;
            const due = document.getElementById('prof-task-due').value;
            const platform = document.getElementById('prof-task-platform').value;
            if (!title) { showToast('Informe o título da tarefa.', 'warn'); return; }

            const list = document.getElementById('prof-tasks-list');
            if (!list) return;
            const tagMap = { mat: 'Mat', por: 'Port', bio: 'FE', qui: 'BE', fis: 'Fís', his: 'His' };
            const dueText = due ? new Date(due + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : 'sem prazo';
            const plabels = { interna: 'Estuda CEEP', 'redacao-pr': 'Redação Paraná', classroom: 'Google Classroom', livro: 'Livro Didático' };

            const emptyState = list.querySelector('.prof-tasks-empty');
            if (emptyState) emptyState.remove();

            list.insertAdjacentHTML('afterbegin', `
                <div class="prof-pub-item">
                    <span class="task-tag tag-${subject}">${tagMap[subject]}</span>
                    <div class="prof-pub-item-body">
                        <div class="rt-chip-name">${title}</div>
                        <div class="modal-stat-meta" style="font-size:11px;margin-top:2px;">Vence ${dueText} · ${plabels[platform] || platform}</div>
                    </div>
                </div>`);

            document.getElementById('prof-task-title').value = '';
            document.getElementById('prof-task-desc').value = '';
            document.getElementById('prof-task-due').value = '';
            showToast(`Tarefa "${title}" publicada com sucesso!`, 'success');
        });
    }

    document.querySelectorAll('.sync-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const original = this.textContent;
            this.textContent = 'Sincronizando...';
            this.disabled = true;
            setTimeout(() => {
                this.textContent = '✓ Atualizado';
                setTimeout(() => { this.textContent = original; this.disabled = false; }, 2000);
            }, 1200);
        });
    });

    // ─── PROFESSOR: TAREFAS ATIVAS (dados + render + ações) ───────────────────

    const TURMAS = {
        '3A': { label: '3º A', total: 0 },
        '3B': { label: '3º B', total: 0 },
        '2A': { label: '2º A', total: 0 },
    };

    let ativasData = [];

    let realizadasData = [];

    // Atualiza o card "Histórico de Tarefas" com a quantidade real de tarefas presentes neste card.
    const profHistoricoCountEl = document.getElementById('prof-historico-count');
    if (profHistoricoCountEl) profHistoricoCountEl.textContent = realizadasData.length;

    // ── Dados: Alunos Destaques (3 por turma) ──
    const alunosDestaquesData = {};

    const alunosDestaquesExpanded = {};

    function renderModalAlunosDestaques() {
        const wrap = document.getElementById('modal-alunos-destaques-list');
        if (!wrap) return;
        const TURMA_LABELS = { '3A': '3º A', '3B': '3º B', '2A': '2º A' };

        wrap.innerHTML = Object.entries(alunosDestaquesData).map(([tk, alunos]) => {
            const isOpen = !!alunosDestaquesExpanded[tk];
            const itens = alunos.map(a => `
                <div class="modal-stat-item">
                    <div class="student-avatar" style="background:${a.color};">${a.initials}</div>
                    <div class="modal-stat-body">
                        <div class="modal-stat-title">${a.name}</div>
                        <div class="modal-stat-meta">${a.meta}</div>
                    </div>
                    <span class="modal-badge modal-badge-ok">${a.badge}</span>
                </div>`).join('');
            return `
                <div class="nr-turma-section" data-turma="${tk}">
                    <button class="nr-turma-header nr-turma-toggle" data-turma="${tk}">
                        <div class="nr-turma-header-left">
                            <span class="nr-turma-label">${TURMA_LABELS[tk] || tk}</span>
                            <span class="nr-turma-count">Alunos da turma</span>
                        </div>
                        <span class="nr-turma-arrow">${isOpen ? '▲' : '▼'}</span>
                    </button>
                    <div class="modal-stat-list nr-turma-alunos" style="display:${isOpen ? 'block' : 'none'};">${itens}</div>
                </div>`;
        }).join('') || '<p class="modal-stat-meta" style="padding:16px">Nenhum aluno destaque cadastrado.</p>';

        wrap.querySelectorAll('.nr-turma-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                const tk = btn.dataset.turma;
                alunosDestaquesExpanded[tk] = !alunosDestaquesExpanded[tk];
                renderModalAlunosDestaques();
            });
        });
    }

    // ── Dados: Tarefas Não Realizadas (por turma) ──
    const naoRealizadasData = {};

    const TAG_MAP = { mat: 'Mat', por: 'Port', bio: 'FE', qui: 'BE', fis: 'Fís', his: 'His' };

    function calcTurmasTotal(turmas) {
        let entregues = 0, total = 0;
        Object.values(turmas).forEach(t => { entregues += t.entregues; total += t.total; });
        return { entregues, total, pct: total === 0 ? 0 : Math.round(entregues / total * 100) };
    }

    function badgeClassFromPct(pct) {
        if (pct === 100) return 'modal-badge-ok';
        if (pct >= 70) return 'modal-badge-ok';
        if (pct >= 40) return 'modal-badge-warn';
        return 'modal-badge-error';
    }

    function dueLabelFromDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr + 'T12:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diff = Math.round((d - today) / 86400000);
        if (diff === 0) return 'Vence hoje';
        if (diff === 1) return 'Vence amanhã';
        return 'Vence ' + d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    }

    // ─── RELATÓRIO DE TAREFAS (Área do Professor) ───
    // Lista completa de alunos por turma (usada para o relatório de entregas).
    const ROSTERS = {
        '3A': [],
        '3B': [],
        '2A': [],
    };

    const RT_TURMA_LABEL = { '3A': '3º A', '3B': '3º B', '2A': '2º A' };
    const RT_AVATAR_PALETTE = ['var(--mat)', 'var(--port)', 'var(--bio)', 'var(--qui)', 'var(--fis)', 'var(--hist)'];

    function rtInitials(name) {
        const parts = name.trim().split(' ');
        return ((parts[0][0] || '') + (parts[parts.length - 1][0] || '')).toUpperCase();
    }

    function rtAvatarColor(name) {
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
        return RT_AVATAR_PALETTE[hash % RT_AVATAR_PALETTE.length];
    }

    // Junta tarefas ativas + passadas em uma lista única para o relatório.
    function rtGetAllTarefas() {
        const ativas = ativasData.map(t => ({
            id: t.id, subject: t.subject, title: t.title, status: 'ativa',
            dueLabel: dueLabelFromDate(t.due), turmas: t.turmas,
        }));
        const passadas = realizadasData.map(t => ({
            id: t.id, subject: t.subject, title: t.title, status: 'passada',
            dueLabel: 'Venceu ' + t.dueLabel, turmas: t.turmas,
        }));
        return [...ativas, ...passadas];
    }

    function rtTarefasDaTurma(turma) {
        return rtGetAllTarefas().filter(t => t.turmas[turma]);
    }

    let rtTurma = '3A';
    let rtTaskId = null;
    let rtStatusFilter = 'entregou';

    function rtPopulateTaskSelect() {
        const select = document.getElementById('rt-task-select');
        if (!select) return;
        const tarefas = rtTarefasDaTurma(rtTurma);
        if (!tarefas.length) {
            select.innerHTML = '<option value="">Nenhuma tarefa para esta turma</option>';
            rtTaskId = null;
            return;
        }
        if (!rtTaskId || !tarefas.some(t => t.id === rtTaskId)) {
            rtTaskId = tarefas[0].id;
        }
        select.innerHTML = tarefas.map(t =>
            `<option value="${t.id}" ${t.id === rtTaskId ? 'selected' : ''}>${t.title}</option>`
        ).join('');
    }

    function renderRelatorioTarefas() {
        rtPopulateTaskSelect();

        const summaryEl = document.getElementById('rt-summary');
        const progressBar = document.getElementById('rt-progress-bar');
        const listEl = document.getElementById('rt-students-list');
        if (!listEl) return;

        const roster = ROSTERS[rtTurma] || [];
        const tarefas = rtTarefasDaTurma(rtTurma);
        const tarefa = tarefas.find(t => t.id === rtTaskId);

        if (!tarefa) {
            if (summaryEl) summaryEl.textContent = '';
            if (progressBar) progressBar.style.width = '0%';
            listEl.innerHTML = '<p class="modal-stat-meta" style="padding:16px">Nenhuma tarefa cadastrada para esta turma.</p>';
            return;
        }

        const turmaInfo = tarefa.turmas[rtTurma];
        const entregues = turmaInfo.entregues;
        const total = turmaInfo.total;
        const pct = total === 0 ? 0 : Math.round((entregues / total) * 100);

        if (summaryEl) {
            const naoEntregaram = total - entregues;
            const pctNao = total === 0 ? 0 : Math.round((naoEntregaram / total) * 100);
            const isEntregouView = rtStatusFilter === 'entregou';
            if (isEntregouView) {
                summaryEl.innerHTML = `
                    <span class="rt-stat-num">${entregues}/${total}</span>
                    <span class="rt-stat-label">alunos fizeram a tarefa</span>
                    <span class="rt-stat-pct">${pct}%</span>`;
            } else {
                summaryEl.innerHTML = `
                    <span class="rt-stat-num">${naoEntregaram}/${total}</span>
                    <span class="rt-stat-label">alunos não fizeram a tarefa</span>
                    <span class="rt-stat-pct--pend">${pctNao}%</span>`;
            }
        }
        if (progressBar) progressBar.style.width = pct + '%';

        // Os primeiros N alunos da lista (N = entregues) aparecem como "Entregou".
        const alunos = roster.map((name, i) => ({ name, entregou: i < entregues }));
        const filtrados = alunos.filter(a => rtStatusFilter === 'entregou' ? a.entregou : !a.entregou);

        if (!filtrados.length) {
            listEl.innerHTML = '<p class="modal-stat-meta" style="padding:16px">Nenhum aluno neste filtro.</p>';
            return;
        }
        const isEntregou = rtStatusFilter === 'entregou';
        listEl.innerHTML = `
            <div class="rt-chips-container ${isEntregou ? 'rt-chips--ok' : 'rt-chips--pend'}">
                <div class="rt-chips-inner">
                    ${filtrados.map(a => `
                        <div class="rt-chip">
                            <div class="rt-chip-avatar" style="background:${rtAvatarColor(a.name)};">${rtInitials(a.name)}</div>
                            <span class="rt-chip-name">${a.name}</span>
                        </div>`).join('')}
                </div>
            </div>`;
    }

    const rtTurmaFilterEl = document.getElementById('rt-turma-filter');
    if (rtTurmaFilterEl) {
        rtTurmaFilterEl.addEventListener('click', e => {
            const btn = e.target.closest('.turma-filter-btn');
            if (!btn) return;
            rtTurma = btn.dataset.turma;
            rtTaskId = null;
            rtTurmaFilterEl.querySelectorAll('.turma-filter-btn').forEach(b => b.classList.toggle('active', b === btn));
            renderRelatorioTarefas();
        });
    }

    const rtTaskSelectEl = document.getElementById('rt-task-select');
    if (rtTaskSelectEl) {
        rtTaskSelectEl.addEventListener('change', () => {
            rtTaskId = rtTaskSelectEl.value;
            renderRelatorioTarefas();
        });
    }

    const rtStatusFiltersEl = document.getElementById('rt-status-filters');
    if (rtStatusFiltersEl) {
        rtStatusFiltersEl.addEventListener('click', e => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;
            rtStatusFilter = btn.dataset.status;
            rtStatusFiltersEl.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
            renderRelatorioTarefas();
        });
    }

    renderRelatorioTarefas();

    // ── Render: Tarefas Ativas ──
    const ativasExpanded = {};

    function renderModalAtivas() {
        const list = document.getElementById('modal-ativas-list');
        if (!list) return;
        list.innerHTML = ativasData.map(ta => {
            const { entregues, total, pct } = calcTurmasTotal(ta.turmas);
            const bc = badgeClassFromPct(pct);
            const dueText = dueLabelFromDate(ta.due);
            const isUrgente = ta.due <= new Date().toISOString().slice(0, 10);
            const turmasHtml = Object.entries(ta.turmas).map(([tk, tv]) => {
                const tp = Math.round(tv.entregues / tv.total * 100);
                return `<span class="turma-delivery-chip">${TURMAS[tk]?.label || tk}: ${tv.entregues}/${tv.total} (${tp}%)</span>`;
            }).join('');
            const isOpen = !!ativasExpanded[ta.id];

            return `
            <div class="modal-stat-item modal-ativa-item" data-id="${ta.id}">
                <span class="task-tag tag-${ta.subject}">${TAG_MAP[ta.subject]}</span>
                <div class="modal-stat-body">
                    <div class="modal-stat-title">${ta.title}</div>
                    <div class="modal-stat-meta ${isUrgente ? 'tf-due-today' : ''}">
                        ${dueText} · <strong>${entregues}/${total} entregues</strong>
                    </div>
                    <div class="ativa-ver-mais-row">
                        <button class="ativa-ver-mais-btn" data-id="${ta.id}" title="${isOpen ? 'Ocultar' : 'Ver progresso'}">
                            ${isOpen ? '▲ Ocultar' : '▼ Ver progresso'}
                        </button>
                    </div>
                    <div class="ativa-progresso-detalhe" style="display:${isOpen ? 'block' : 'none'};">
                        <div class="turma-delivery-row">${turmasHtml}</div>
                        <div class="entrega-progress-bar-wrap">
                            <div class="entrega-progress-bar" style="width:${pct}%"></div>
                        </div>
                        <span class="modal-badge ${bc}" style="margin-top:6px;display:inline-block;">${pct}%</span>
                    </div>
                </div>
                <div class="ativa-actions">
                    <div class="ativa-btn-row">
                        <button class="ativa-btn ativa-btn-del" data-id="${ta.id}" title="Excluir tarefa">🗑️</button>
                    </div>
                </div>
            </div>`;
        }).join('') || '<p class="modal-stat-meta" style="padding:16px">Nenhuma tarefa ativa no momento.</p>';

        // Listener: toggle ver mais
        list.querySelectorAll('.ativa-ver-mais-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                const id = btn.dataset.id;
                ativasExpanded[id] = !ativasExpanded[id];
                renderModalAtivas();
            });
        });

        // Listener: excluir
        list.querySelectorAll('.ativa-btn-del').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                const id = btn.dataset.id;
                const ta = ativasData.find(t => t.id === id);
                if (!ta) return;
                ativasData = ativasData.filter(t => t.id !== id);
                delete ativasExpanded[id];
                renderModalAtivas();
                showToast(`Tarefa "${ta.title}" excluída.`, 'success');
            });
        });
    }

    // ── Render: Tarefas Não Realizadas (agrupadas por turma) ──
    const naoRealizadasExpanded = {};

    function renderModalNaoRealizadas() {
        const wrap = document.getElementById('modal-nao-realizadas-list');
        if (!wrap) return;
        const TURMA_LABELS = { '3A': '3º A', '3B': '3º B', '2A': '2º A' };

        wrap.innerHTML = Object.entries(naoRealizadasData).map(([tk, alunos]) => {
            if (!alunos.length) return '';
            const isOpen = !!naoRealizadasExpanded[tk];
            const itens = alunos.map(a => `
                <div class="modal-stat-item">
                    <div class="student-avatar" style="background:${a.color};">${a.initials}</div>
                    <div class="modal-stat-body">
                        <div class="modal-stat-title">${a.name}</div>
                        <div class="modal-stat-meta">${a.meta}</div>
                    </div>
                    <span class="modal-badge modal-badge-${a.status}">${a.label}</span>
                </div>`).join('');
            return `
                <div class="nr-turma-section" data-turma="${tk}">
                    <button class="nr-turma-header nr-turma-toggle" data-turma="${tk}">
                        <div class="nr-turma-header-left">
                            <span class="nr-turma-label">${TURMA_LABELS[tk] || tk}</span>
                            <span class="nr-turma-count">${alunos.length} aluno${alunos.length > 1 ? 's' : ''} com pendência</span>
                        </div>
                        <span class="nr-turma-arrow">${isOpen ? '▲' : '▼'}</span>
                    </button>
                    <div class="modal-stat-list nr-turma-alunos" style="display:${isOpen ? 'block' : 'none'};">${itens}</div>
                </div>`;
        }).join('') || '<p class="modal-stat-meta" style="padding:16px">Nenhum aluno com pendências.</p>';

        wrap.querySelectorAll('.nr-turma-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                const tk = btn.dataset.turma;
                naoRealizadasExpanded[tk] = !naoRealizadasExpanded[tk];
                renderModalNaoRealizadas();
            });
        });
    }

    // ── Render: Tarefas Passadas — só contagem de entregas ──
    let realizadasTurmaFilter = '3A';

    function renderModalRealizadas() {
        const list = document.getElementById('modal-realizadas-list');
        if (!list) return;

        list.innerHTML = realizadasData.map(tr => {
            const turmasVisiveis = Object.entries(tr.turmas).filter(([tk]) =>
                realizadasTurmaFilter === tk
            );
            if (!turmasVisiveis.length) return '';
            let entregues = 0, total = 0;
            turmasVisiveis.forEach(([, tv]) => { entregues += tv.entregues; total += tv.total; });

            return `
            <div class="modal-stat-item">
                <span class="task-tag tag-${tr.subject}">${TAG_MAP[tr.subject]}</span>
                <div class="modal-stat-body">
                    <div class="modal-stat-title">${tr.title}</div>
                    <div class="modal-stat-meta">Venceu ${tr.dueLabel} · <strong>${entregues}/${total} entregues</strong></div>
                </div>
            </div>`;
        }).filter(Boolean).join('') || '<p class="modal-stat-meta" style="padding:16px">Nenhuma tarefa para esta turma.</p>';
    }

    // Filtro turma no modal realizadas
    const realizadasTurmaFilterEl = document.getElementById('modal-realizadas-turma-filter');
    if (realizadasTurmaFilterEl) {
        realizadasTurmaFilterEl.addEventListener('click', e => {
            const btn = e.target.closest('.turma-filter-btn');
            if (!btn) return;
            realizadasTurmaFilter = btn.dataset.turma;
            realizadasTurmaFilterEl.querySelectorAll('.turma-filter-btn').forEach(b => b.classList.toggle('active', b === btn));
            renderModalRealizadas();
        });
    }

    // Exportar relatório
    const exportBtn = document.getElementById('modal-realizadas-export');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => showToast('Relatório exportado com sucesso!', 'success'));
    }

    // ── Abrir modais e renderizar ──
    const origStatCardListener = document.querySelectorAll('.stat-card--clickable[data-modal]');
    origStatCardListener.forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.modal;
            if (id === 'modal-tarefas-ativas') renderModalAtivas();
            if (id === 'modal-realizadas') renderModalRealizadas();
            if (id === 'modal-nao-realizadas') renderModalNaoRealizadas();
            if (id === 'modal-alunos-ativos') renderModalAlunosDestaques();
        });
    });


    // ══════════════════════════════════════════════
    // ── MATÉRIAS — GRADE REATIVA + MODALS + ARQUIVOS
    // ══════════════════════════════════════════════

    // Mural / avisos por matéria (último recado do professor) — sem avisos de exemplo
    const MATERIAS_MURAL = {};

    // Dados das matérias — tópicos, professor e arquivos populados a partir de dados reais (vazio por padrão)
    const MATERIAS_DATA = {
        mat: {
            name: 'Matemática', tag: 'Mat', color: 'var(--mat)', colorHex: '#FF8A5B',
            prof: '',
            topicos: [],
            arquivos: []
        },
        por: {
            name: 'Português', tag: 'Port', color: 'var(--port)', colorHex: '#5FB3E8',
            prof: '',
            topicos: [],
            arquivos: []
        },
        bio: {
            name: 'Front-End', tag: 'FE', color: 'var(--bio)', colorHex: '#6FCF7A',
            prof: '',
            topicos: [],
            arquivos: []
        },
        qui: {
            name: 'Back-End', tag: 'BE', color: 'var(--qui)', colorHex: '#FFD166',
            prof: '',
            topicos: [],
            arquivos: []
        },
        fis: {
            name: 'Física', tag: 'Fís', color: 'var(--fis)', colorHex: '#FF6B9D',
            prof: '',
            topicos: [],
            arquivos: []
        },
        his: {
            name: 'História', tag: 'His', color: 'var(--hist)', colorHex: '#C792EA',
            prof: '',
            topicos: [],
            arquivos: []
        }
    };

    // ── Estado runtime ──
    const matTopicoState  = {};  // chave: 'mat-0' → bool
    const matArquivosExtra = {}; // arquivos adicionados pelo aluno

    function getMatArquivos(subj) {
        return [...(MATERIAS_DATA[subj].arquivos || []), ...(matArquivosExtra[subj] || [])];
    }

    function matTopicoDone(subj, idx) {
        const key = `${subj}-${idx}`;
        return (key in matTopicoState) ? matTopicoState[key] : MATERIAS_DATA[subj].topicos[idx].done;
    }

    function matCalcProgress(subj) {
        const tops = MATERIAS_DATA[subj].topicos;
        if (!tops.length) return 0;
        return Math.round(tops.filter((t, i) => matTopicoDone(subj, i)).length / tops.length * 100);
    }

    // Contagem real de pendentes vinda de taskList
    function matCountPending(subj) {
        return taskList.filter(t => t.subject === subj && !t.done).length;
    }

    // ── Constantes de UI ──
    const TYPE_ICON  = { slide: '🖼️', video: '▶️', pdf: '📄', link: '🔗' };
    const TYPE_LABEL = { slide: 'Slide', video: 'Vídeo', pdf: 'PDF', link: 'Link' };

    // ── Estado de filtros ──
    let matSearchVal      = '';
    let matProgressFilter = 'todas';
    let matViewMode       = 'grid';

    // ── Render da grade ──
    function matRenderGrid() {
        const grid  = document.getElementById('mat-subject-grid');
        const empty = document.getElementById('mat-empty');
        if (!grid) return;

        grid.className = 'subject-grid' + (matViewMode === 'list' ? ' list-mode' : '');

        const search = matSearchVal.toLowerCase();
        const keys = Object.keys(MATERIAS_DATA).filter(k => {
            const m = MATERIAS_DATA[k];
            const pct = matCalcProgress(k);
            const match = m.name.toLowerCase().includes(search) || m.prof.toLowerCase().includes(search);
            if (!match) return false;
            if (matProgressFilter === 'ok')      return pct >= 70;
            if (matProgressFilter === 'atencao') return pct < 70;
            return true;
        });

        if (!keys.length) {
            grid.innerHTML = '';
            if (empty) empty.style.display = '';
            return;
        }
        if (empty) empty.style.display = 'none';

        grid.innerHTML = keys.map(k => {
            const m    = MATERIAS_DATA[k];
            const pct  = matCalcProgress(k);
            const pend = matCountPending(k); // real, vinda de taskList
            const mural = MATERIAS_MURAL[k];

            const badgeHtml = pend > 0
                ? `<span class="subject-badge subject-badge-warn">${pend} pendente${pend > 1 ? 's' : ''}</span>`
                : `<span class="subject-badge subject-badge-ok">Em dia ✓</span>`;

            const muralHtml = mural
                ? `<div class="subject-mural">
                       <span class="subject-mural-icon">📌</span>
                       <span class="subject-mural-msg">${mural.msg}</span>
                       <span class="subject-mural-date">${mural.date}</span>
                   </div>`
                : '';

            return `
            <article class="subject-card" data-subject="${k}" data-open-materia="${k}">
                <div class="subject-tab"></div>
                <div class="subject-body">
                    <div class="subject-head">
                        <span class="subject-name">${m.name}</span>
                        ${badgeHtml}
                    </div>
                    <div class="topics">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                            <span style="font-size:12px;color:var(--branco);font-weight:600;">Progresso</span>
                            <span style="font-size:12px;font-weight:700;color:var(--branco);">${pct}%</span>
                        </div>
                        <div class="progress-container">
                            <div class="progress-bar ${k}" style="width:${pct}%;"></div>
                        </div>
                        <p style="margin:8px 0 4px;font-size:12px;color:var(--branco);">${m.prof}</p>
                    </div>
                    ${muralHtml}
                    <p class="subject-card-hint-open">Clique para detalhes →</p>
                </div>
            </article>`;
        }).join('');

        // Atualiza pills de stats (usa taskList para pendências reais)
        const all   = Object.keys(MATERIAS_DATA);
        const concl = all.filter(k => matCalcProgress(k) === 100).length;
        const pends = all.filter(k => matCountPending(k) > 0).length;
        const avg   = Math.round(all.reduce((s, k) => s + matCalcProgress(k), 0) / all.length);
        const sc = document.getElementById('mat-stat-conc');
        const sp = document.getElementById('mat-stat-pend');
        const sa = document.getElementById('mat-stat-avg');
        if (sc) sc.textContent = concl;
        if (sp) sp.textContent = pends;
        if (sa) sa.textContent = avg + '%';
        const arc = document.getElementById('mat-stat-avg-arc');
        if (arc) arc.style.strokeDashoffset = 176 - (176 * avg / 100);

        // Abre modal ao clicar
        grid.querySelectorAll('[data-open-materia]').forEach(card => {
            card.addEventListener('click', () => matOpenModal(card.dataset.openMateria));
        });
    }

    // Registra globalmente para que navigateTo possa chamar antes do primeiro render
    window._matRenderGrid = matRenderGrid;

    // ── Filtros e view-toggle ──
    document.getElementById('mat-search')?.addEventListener('input', e => {
        matSearchVal = e.target.value;
        matRenderGrid();
    });

    document.getElementById('mat-progress-filters')?.addEventListener('click', e => {
        const btn = e.target.closest('[data-mf]');
        if (!btn) return;
        matProgressFilter = btn.dataset.mf;
        document.querySelectorAll('#mat-progress-filters [data-mf]')
            .forEach(b => b.classList.toggle('active', b === btn));
        matRenderGrid();
    });

    document.getElementById('mat-view-grid')?.addEventListener('click', () => {
        matViewMode = 'grid';
        document.getElementById('mat-view-grid').classList.add('active');
        document.getElementById('mat-view-list').classList.remove('active');
        matRenderGrid();
    });

    document.getElementById('mat-view-list')?.addEventListener('click', () => {
        matViewMode = 'list';
        document.getElementById('mat-view-list').classList.add('active');
        document.getElementById('mat-view-grid').classList.remove('active');
        matRenderGrid();
    });

    // ── Modal de Matéria ──
    let matModalActive = null;
    let matModalTab    = 'topicos';
    let mmFileType     = 'slide';
    let mmFileFormOpen = false;

    function matUpdateModalHeader(subj) {
        const m    = MATERIAS_DATA[subj];
        const pct  = matCalcProgress(subj);
        const tops = m.topicos;
        const doneCount = tops.filter((t, i) => matTopicoDone(subj, i)).length;
        const pendCount = matCountPending(subj);

        const circumference = 2 * Math.PI * 32;
        const arc = document.getElementById('materia-modal-ring-arc');
        if (arc) {
            arc.style.strokeDashoffset = circumference - (pct / 100) * circumference;
        }
        const pctEl = document.getElementById('materia-modal-ring-pct');
        if (pctEl) pctEl.textContent = pct + '%';

        const tdEl = document.getElementById('materia-modal-topics-done');
        if (tdEl) tdEl.textContent = `${doneCount}/${tops.length}`;

        const tpEl = document.getElementById('materia-modal-tasks-pend');
        if (tpEl) tpEl.textContent = pendCount;
    }

    function matOpenModal(subj) {
        matModalActive = subj;
        matModalTab    = 'topicos';
        mmFileFormOpen = false;

        const m       = MATERIAS_DATA[subj];
        const overlay = document.getElementById('materia-modal');
        if (!overlay) return;

        // Esconde o form de adicionar link
        const addForm = document.getElementById('materia-modal-add-file-form');
        if (addForm) addForm.style.display = 'none';

        // Cabeçalho com gradiente na cor da matéria
        const header = document.getElementById('materia-modal-header');
        if (header) header.style.background =
            `linear-gradient(135deg, ${m.colorHex}dd, ${m.colorHex}88)`;

        const tagEl  = document.getElementById('materia-modal-tag');
        const nameEl = document.getElementById('materia-modal-name');
        const profEl = document.getElementById('materia-modal-prof');
        if (tagEl)  tagEl.textContent  = m.tag;
        if (nameEl) nameEl.textContent = m.name;
        if (profEl) profEl.textContent = m.prof;

        // Mural no modal (aba Tópicos — topo)
        const muralEl = document.getElementById('materia-modal-mural-banner');
        const mural   = MATERIAS_MURAL[subj];
        if (muralEl) {
            if (mural) {
                muralEl.style.display = '';
                muralEl.innerHTML = `<span class="materia-modal-mural-icon">📌</span>
                    <div class="materia-modal-mural-body">
                        <span class="materia-modal-mural-label">Recado do professor</span>
                        <span class="materia-modal-mural-text">${mural.msg}</span>
                    </div>
                    <span class="materia-modal-mural-date">${mural.date}</span>`;
            } else {
                muralEl.style.display = 'none';
            }
        }

        matUpdateModalHeader(subj);
        matRenderModalPanels(subj);
        openModal('materia-modal');
    }

    function matRenderModalPanels(subj) {
        matRenderTabTopicos(subj);
        matRenderTabTarefas(subj);
        matRenderTabArquivos(subj);

        document.querySelectorAll('.materia-modal-tab')
            .forEach(t => t.classList.toggle('active', t.dataset.mmtab === matModalTab));

        ['topicos', 'tarefas', 'arquivos'].forEach(tab => {
            const p = document.getElementById(`materia-modal-panel-${tab}`);
            if (p) p.style.display = (tab === matModalTab) ? '' : 'none';
        });
    }

    function matRenderTabTopicos(subj) {
        const list = document.getElementById('materia-modal-topicos-list');
        if (!list) return;
        const tops = MATERIAS_DATA[subj].topicos;
        list.innerHTML = tops.map((t, i) => {
            const done = matTopicoDone(subj, i);
            return `<div class="materia-modal-topico-item${done ? ' done' : ''}" data-subj="${subj}" data-idx="${i}">
                <div class="materia-modal-topico-dot"></div>
                <span class="materia-modal-topico-text">${t.text}</span>
                <span class="materia-modal-topico-day">${t.day}</span>
            </div>`;
        }).join('');

        list.querySelectorAll('.materia-modal-topico-item').forEach(item => {
            item.addEventListener('click', () => {
                const s   = item.dataset.subj;
                const idx = parseInt(item.dataset.idx);
                const key = `${s}-${idx}`;
                matTopicoState[key] = !matTopicoDone(s, idx);
                matRenderTabTopicos(s);
                matUpdateModalHeader(s);
                matRenderGrid(); // atualiza barra de progresso no card
            });
        });
    }

    function matRenderTabTarefas(subj) {
        const wrap = document.getElementById('materia-modal-tarefas-list');
        if (!wrap) return;
        const related = taskList.filter(t => t.subject === subj);
        if (!related.length) {
            wrap.innerHTML = '<div class="materia-modal-tarefa-empty">Nenhuma tarefa para esta matéria.</div>';
            return;
        }
        wrap.innerHTML = related.map(t => {
            const sc = TASK_SUBJECTS[t.subject] || { tag: t.subject };
            const dueClass = t.done ? '' : taskDueClass(t);
            return `<div class="materia-modal-tarefa-item${t.done ? ' done' : ''}">
                <span class="task-tag tag-${t.subject}">${sc.tag}</span>
                <div>
                    <div class="materia-modal-tarefa-title">${t.title}</div>
                    <div class="materia-modal-tarefa-meta ${dueClass}">${t.desc}</div>
                </div>
                ${t.done ? '<span style="margin-left:auto;font-size:18px;">✅</span>' : ''}
            </div>`;
        }).join('');
    }

    function matRenderTabArquivos(subj) {
        const list = document.getElementById('materia-modal-arquivos-list');
        if (!list) return;
        const arqs = getMatArquivos(subj);
        if (!arqs.length) {
            list.innerHTML = `<div class="materia-modal-arquivo-empty">
                <div class="materia-modal-arquivo-empty-text">Nenhum arquivo ainda.<br>Clique em "+ Adicionar link" para começar.</div>
            </div>`;
            return;
        }
        list.innerHTML = arqs.map(a => `
            <div class="materia-modal-arquivo-item" data-url="${a.url}">
                <div class="materia-modal-arquivo-icon">${TYPE_ICON[a.type] || '🔗'}</div>
                <div class="materia-modal-arquivo-info">
                    <div class="materia-modal-arquivo-title">${a.title}</div>
                    <div class="materia-modal-arquivo-meta">${TYPE_LABEL[a.type] || 'Link'} · ${a.meta}</div>
                </div>
            </div>`).join('');

        // Abrir link (exceto se clicar no botão remover)
        list.querySelectorAll('.materia-modal-arquivo-item').forEach(item => {
            item.addEventListener('click', e => {
                if (e.target.closest('.materia-modal-arquivo-del')) return;
                window.open(item.dataset.url, '_blank');
            });
        });

        list.querySelectorAll('.materia-modal-arquivo-del').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                const aid = btn.dataset.aid;
                MATERIAS_DATA[subj].arquivos =
                    MATERIAS_DATA[subj].arquivos.filter(a => a.id !== aid);
                if (matArquivosExtra[subj])
                    matArquivosExtra[subj] = matArquivosExtra[subj].filter(a => a.id !== aid);
                matRenderTabArquivos(subj);
                showToast('Arquivo removido.', 'success');
            });
        });
    }

    // ── Tabs internas do modal ──
    document.querySelector('.materia-modal-tabs')?.addEventListener('click', e => {
        const btn = e.target.closest('[data-mmtab]');
        if (!btn || !matModalActive) return;
        matModalTab = btn.dataset.mmtab;
        document.querySelectorAll('.materia-modal-tab')
            .forEach(t => t.classList.toggle('active', t === btn));
        ['topicos', 'tarefas', 'arquivos'].forEach(tab => {
            const p = document.getElementById(`materia-modal-panel-${tab}`);
            if (p) p.style.display = (tab === matModalTab) ? '' : 'none';
        });
    });

    // ── Fechar modal ──
    document.getElementById('materia-modal-close')?.addEventListener('click', () => {
        closeModal('materia-modal');
    });
    document.getElementById('materia-modal')?.addEventListener('click', function(e) {
        if (e.target === this) closeModal('materia-modal');
    });

    // ── Formulário de adicionar arquivo ──
    document.getElementById('materia-modal-add-file-btn')?.addEventListener('click', () => {
        mmFileFormOpen = !mmFileFormOpen;
        const form = document.getElementById('materia-modal-add-file-form');
        if (form) form.style.display = mmFileFormOpen ? '' : 'none';
    });

    document.getElementById('materia-modal-file-cancel')?.addEventListener('click', () => {
        mmFileFormOpen = false;
        const form = document.getElementById('materia-modal-add-file-form');
        if (form) form.style.display = 'none';
    });

    document.getElementById('materia-modal-file-types')?.addEventListener('click', e => {
        const btn = e.target.closest('[data-type]');
        if (!btn) return;
        mmFileType = btn.dataset.type;
        document.querySelectorAll('#materia-modal-file-types [data-type]')
            .forEach(b => b.classList.toggle('active', b === btn));
    });

    document.getElementById('materia-modal-file-confirm')?.addEventListener('click', () => {
        const titleEl = document.getElementById('materia-modal-file-title');
        const urlEl   = document.getElementById('materia-modal-file-url');
        const title   = titleEl?.value.trim();
        const url     = urlEl?.value.trim();

        if (!title || !url) {
            showToast('Preencha o título e a URL.', 'warn');
            return;
        }
        if (!matModalActive) return;

        const subj = matModalActive;
        if (!matArquivosExtra[subj]) matArquivosExtra[subj] = [];
        matArquivosExtra[subj].push({
            id:    `${subj}-extra-${Date.now()}`,
            title, type: mmFileType, url,
            meta: 'Adicionado por você'
        });

        if (titleEl) titleEl.value = '';
        if (urlEl)   urlEl.value   = '';
        mmFileFormOpen = false;
        const form = document.getElementById('materia-modal-add-file-form');
        if (form) form.style.display = 'none';

        matRenderTabArquivos(subj);
        showToast(`"${title}" adicionado!`, 'success');
    });

    // ── Inicialização ──
    // Primeira carga se já estiver na rota #materias
    if (window.location.hash === '#materias') matRenderGrid();

    // Garante render ao retornar para a aba (complementa navigateTo via window._matRenderGrid)
    setTimeout(() => {
        const view = document.getElementById('view-materias');
        if (view && view.classList.contains('active')) matRenderGrid();
    }, 100);

    // ── MENU MOBILE (hamburguer) ──
    const mobileMenuBtn  = document.getElementById('mobile-menu-btn');
    const sidebarEl      = document.querySelector('.sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    function openSidebar() {
        sidebarEl?.classList.add('open');
        sidebarOverlay?.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebarEl?.classList.remove('open');
        sidebarOverlay?.classList.remove('open');
        document.body.style.overflow = '';
    }

    mobileMenuBtn?.addEventListener('click', () => {
        sidebarEl?.classList.contains('open') ? closeSidebar() : openSidebar();
    });

    sidebarOverlay?.addEventListener('click', closeSidebar);

    // Fecha o drawer ao navegar por um item do menu
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) closeSidebar();
        });
    });

});
