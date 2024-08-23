document.addEventListener('DOMContentLoaded', () => {
    const idForm = document.getElementById('id-form');
    const userIdInput = document.getElementById('user-id');
    const armyCreator = document.getElementById('army-creator');
    const countrySelect = document.getElementById('country-select');
    const unitSelect = document.getElementById('unit-select');
    const armyList = document.getElementById('army-list');
    const totalPointsElement = document.getElementById('total-points');
    const specialModal = document.getElementById('special-modal');
    const specialName = document.getElementById('special-name');
    const specialDescription = document.getElementById('special-description');
    const closeModal = document.querySelector('.close');
    
    let userId;
    let currentArmy = [];
    let totalPoints = 0;

    const specialAttributes = {}; // To store special attributes for quick lookup

    const loadAttributes = async () => {
        try {
            const response = await fetch('/unit-attributes');
            const attributes = await response.json();

            // Store special attributes for quick lookup
            attributes.special.forEach(attr => {
                specialAttributes[attr.name] = attr.Description;
            });

            attributes.nation.forEach(country => {
                const option = document.createElement('option');
                option.value = country;
                option.textContent = country;
                countrySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading attributes:', error);
        }
    };

    const loadUnits = async (country) => {
        try {
            const response = await fetch(`/get-units?country=${country}`);
            const units = await response.json();
            unitSelect.innerHTML = '';
            units.forEach(unit => {
                const option = document.createElement('option');
                option.value = JSON.stringify(unit);  // Store the entire unit data as a string
                option.textContent = unit.name;  // Display the unit name in the dropdown
                unitSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading units:', error);
        }
    };

    const loadArmy = async (id) => {
        try {
            const response = await fetch(`/army/${id}`);
            const data = await response.json();
            currentArmy = data.army || [];
            totalPoints = 0; // Reset total points
            currentArmy.forEach(unit => totalPoints += parseInt(unit.points.split(' ')[0])); // Calculate total points
            renderArmyList();
        } catch (error) {
            console.error('Error loading army:', error);
        }
    };

    const renderArmyList = () => {
        armyList.innerHTML = '';
        currentArmy.forEach((unit, index) => {
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
                Special: ${unit.special.map(attr => `<span class="special-attr" data-name="${attr}">${attr}</span>`).join(', ')}<br>
                <button data-index="${index}" class="delete-unit-btn">Delete</button>
            `;
            armyList.appendChild(li);
        });

        // Attach event listeners for delete buttons
        document.querySelectorAll('.delete-unit-btn').forEach(button => {
            button.addEventListener('click', deleteUnit);
        });

        // Attach event listeners for special attribute descriptions
        document.querySelectorAll('.special-attr').forEach(attr => {
            attr.addEventListener('click', showSpecialDescription);
        });

        totalPointsElement.textContent = totalPoints; // Update the displayed total points
    };

    const deleteUnit = (e) => {
        const index = e.target.dataset.index;
        totalPoints -= parseInt(currentArmy[index].points.split(' ')[0]); // Deduct the points of the deleted unit
        currentArmy.splice(index, 1);
        renderArmyList();
    };

    const showSpecialDescription = (e) => {
        const attrName = e.target.dataset.name;
        specialName.textContent = attrName;
        specialDescription.textContent = specialAttributes[attrName] || 'No description available.';
        specialModal.style.display = 'block';
    };

    closeModal.addEventListener('click', () => {
        specialModal.style.display = 'none';
    });

    window.onclick = function(event) {
        if (event.target == specialModal) {
            specialModal.style.display = 'none';
        }
    };

    idForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        userId = userIdInput.value;
        await loadArmy(userId);
        armyCreator.style.display = 'block';
    });

    countrySelect.addEventListener('change', async () => {
        const country = countrySelect.value;
        await loadUnits(country);
    });

    document.getElementById('add-unit-btn').addEventListener('click', () => {
        const selectedUnit = JSON.parse(unitSelect.value); // Parse the selected unit data
        selectedUnit.country = countrySelect.value; // Add the selected country to the unit

        currentArmy.push(selectedUnit);
        totalPoints += parseInt(selectedUnit.points.split(' ')[0]); // Add the points of the new unit
        renderArmyList();
    });

    document.getElementById('save-army-btn').addEventListener('click', async () => {
        try {
            await fetch('/army/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: userId, army: currentArmy })
            });
            alert('Army saved successfully!');
        } catch (error) {
            console.error('Error saving army:', error);
        }
    });

    loadAttributes();
});
