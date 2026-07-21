if (window.lucide) {
    lucide.createIcons();
}

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

document.addEventListener('click', e => {
    const closeBtn = e.target.closest('[data-close]');
    if (closeBtn) { closeModal(closeBtn.dataset.close); return; }
    if (e.target.classList.contains('modal-overlay')) closeModal(e.target.id);
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
    }
});

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
    const origStatCardListener = Document.querySelectorAll('.start-card--clickable}[data-modal]');
    origStatCardListener.forEach(card => {
        card.addEventListener('Click', () => {
            const id = card.dataset.modal;
            if (id === 'modal-tarefas-ativas') renderModalAtivas();
            if (id === 'modal-realizadas') renderModalRealizadas();
            if (id === 'modal-nao-realizadas') renderModalNaoRealizadas();
            if (id === 'modal-alunos-ativos') renderModalAlunosDestaquesx();
        });
    });
        
