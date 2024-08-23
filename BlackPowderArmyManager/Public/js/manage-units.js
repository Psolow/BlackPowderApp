document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('manage-unit-form');
    const unitsList = document.getElementById('units-list');

    const loadAttributes = async () => {
        try {
            const response = await fetch('/unit-attributes');
            const attributes = await response.json();
            
            const fillSelect = (selectId, options, isSpecial = false) => {
                const select = document.getElementById(selectId);
                options.forEach(option => {
                    const opt = document.createElement('option');
                    if (isSpecial) {
                        opt.value = option.name;  // Use the name as the value
                        opt.textContent = option.name;  // Display the name only
                    } else {
                        opt.value = option;
                        opt.textContent = option;
                    }
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
            fillSelect('unit-special', attributes.special, true);  // Pass true for special attributes
        } catch (error) {
            console.error('Error loading attributes:', error);
        }
    };

    const loadUnits = async () => {
        try {
            const response = await fetch('/all-units');
            const units = await response.json();
            renderUnitsList(units);
        } catch (error) {
            console.error('Error loading units:', error);
        }
    };

    const renderUnitsList = (units) => {
        unitsList.innerHTML = '';
        units.forEach((unit) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${unit.name} [${unit.country}]</strong><br>
                Type: ${unit.type}<br>
                Armament: ${unit.armament}<br>
                Hand-to-Hand: ${unit.handToHand}<br>
                Shooting: ${unit.shooting}<br>
                Morale: ${unit.morale}<br>
                Stamina: ${unit.stamina}<br>
                Size: ${unit.size}<br>
                Points: ${unit.points}<br>
                Special: ${unit.special.map(attr => attr).join(', ')}<br>
                <button data-unit="${unit.name}" class="edit-unit-btn">Edit</button>
                <button data-unit="${unit.name}" class="delete-unit-btn">Delete</button>
            `;
            unitsList.appendChild(li);
        });

        // Attach event listeners for edit and delete buttons
        document.querySelectorAll('.edit-unit-btn').forEach(button => {
            button.addEventListener('click', editUnit);
        });
        document.querySelectorAll('.delete-unit-btn').forEach(button => {
            button.addEventListener('click', deleteUnit);
        });
    };

    const editUnit = (e) => {
        const unitName = e.target.dataset.unit;
        // Logic to load unit details into the form for editing
    };

    const deleteUnit = async (e) => {
        const unitName = e.target.dataset.unit;
        try {
            await fetch(`/delete-unit?name=${unitName}`, {
                method: 'DELETE'
            });
            loadUnits(); // Reload the units list after deletion
        } catch (error) {
            console.error('Error deleting unit:', error);
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const selectedSpecials = Array.from(document.getElementById('unit-special').selectedOptions).map(option => option.value);
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
            special: selectedSpecials
        };

        try {
            await fetch('/manage-units', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(unit)
            });
            alert('Unit added successfully!');
            loadUnits();
        } catch (error) {
            console.error('Error adding unit:', error);
        }
    });

    loadAttributes();
    loadUnits();
});
