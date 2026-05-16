let records = JSON.parse(localStorage.getItem('poopRecords')) || [];

document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date');
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    dateInput.value = now.toISOString().slice(0, 16);
    
    renderRecords();
    
    document.getElementById('logForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addRecord();
    });
});

function addRecord() {
    const date = document.getElementById('date').value;
    const quality = parseInt(document.getElementById('quality').value);
    const notes = document.getElementById('notes').value;
    
    const record = {
        id: Date.now(),
        date,
        quality,
        notes
    };
    
    records.unshift(record);
    saveRecords();
    renderRecords();
    
    document.getElementById('logForm').reset();
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('date').value = now.toISOString().slice(0, 16);
}

function deleteRecord(id) {
    if (confirm('确定要删除这条记录吗？')) {
        records = records.filter(record => record.id !== id);
        saveRecords();
        renderRecords();
    }
}

function saveRecords() {
    localStorage.setItem('poopRecords', JSON.stringify(records));
}

function getQualityText(quality) {
    const qualityMap = {
        5: '🌟 非常顺畅',
        4: '✨ 比较顺畅',
        3: '😐 一般',
        2: '😣 有点困难',
        1: '💔 非常困难'
    };
    return qualityMap[quality] || '未知';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function renderRecords() {
    const container = document.getElementById('recordsList');
    
    if (records.length === 0) {
        container.innerHTML = '<div class="empty-state">还没有记录，开始记录你的第一次吧！</div>';
        return;
    }
    
    container.innerHTML = records.map(record => `
        <div class="record-item">
            <div class="record-date">${formatDate(record.date)}</div>
            <div class="record-quality">${getQualityText(record.quality)}</div>
            ${record.notes ? `<div class="record-notes">${record.notes}</div>` : ''}
            <button class="delete-btn" onclick="deleteRecord(${record.id})">删除</button>
        </div>
    `).join('');
}