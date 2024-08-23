document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('manage-unit-form');

    const loadAttributes = async () => {
        try {
            const response = await fetch('/unit-attributes');
            const attributes = await response.json();
            
            const fillSelect = (selectId, options) => {
                const select = document.getElementById(selectId);
                options.forEach(option => {
                    const opt = document.createElement('option');
                    opt.value = option;
                    opt.textContent = option;
                    select.appendChild(opt);
                });
            };
            
            fillSelect('unit-country', attributes.nation);
            fillSelect('unit-type', attributes.type);
            fillSelect('unit-armament', attributes.armament);
            fillSelect('unit-hand-to-hand', attributes["hand-to-hand"]);
            fillSelect('unit-shooting', attributes.shooting);
            fillSelect('unit-morale', attributes.morale);
            fillSelect('unit-stamina', attributes.stamina);
            fillSelect('unit-size', attributes.size);
            fillSelect('unit-points', attributes.points);
            fillSelect('unit-special', attributes.special);
        } catch (error) {
            console.error('Error loading attributes:', error);
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const unit = {
            name: document.getElementById('unit-name').value,
            country: document.getElementById('unit-country').value,
            type: document.getElementById('unit-type').value,
            armament: document.getElementById('unit-armament').value,
            handToHand: document.getElementById('unit-hand-to-hand').value,
            shooting: document.getElementById('unit-shooting').value,
            morale: document.getElementById('unit-morale').value,
            stamina: document.getElementById('unit-stamina').value,
            size: document.getElementById('unit-size').value,
            points: document.getElementById('unit-points').value,
            special: Array.from(document.getElementById('unit-special').selectedOptions).map(option => option.value)
        };

        try {
            await fetch('/manage-units', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(unit)
            });
            alert('Unit added successfully!');
        } catch (error) {
            console.error('Error adding unit:', error);
        }
    });

    loadAttributes();
});
