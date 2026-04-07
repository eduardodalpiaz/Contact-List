const API = "/contacts";

const form = document.getElementById("form");
const list = document.getElementById("list");

// Inputs
const idInput = document.getElementById("id");
const nameInput = document.getElementById("fullName");
const addressInput = document.getElementById("address");
const phoneInput = document.getElementById("phone");
const cityInput = document.getElementById("city");
const countryInput = document.getElementById("country");

// Debug inicial
console.log("Script carregado!");

// Carregar contatos
async function loadContacts() {
    const res = await fetch(API);
    const data = await res.json();

    list.innerHTML = "";

    data.forEach(c => {
        list.innerHTML += `
            <tr>
                <td>${c.name}</td>
                <td>${c.phone}</td>
                <td>${c.city}</td>
                <td>${c.country}</td>
                <td>
                    <button onclick="editContact(${c.id}, '${c.name}', '${c.address}', '${c.phone}', '${c.city}', '${c.country}')">Edit</button>
                    <button onclick="deleteContact(${c.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

// Cadastrar ou atualizar
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const contact = {
        name: nameInput.value.trim(),
        address: addressInput.value.trim(),
        phone: phoneInput.value.trim(),
        city: cityInput.value.trim(),
        country: countryInput.value.trim()
    };

    console.log("JSON enviado:", contact); // Debug

    if (!contact.name || !contact.phone) {
        alert("Name and Phone are required!");
        return;
    }

    if (idInput.value) {
        await fetch(`${API}/${idInput.value}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contact)
        });
    } else {
        await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contact)
        });
    }

    form.reset();
    idInput.value = "";
    loadContacts();
});

// Editar contato
function editContact(id, name, address, phone, city, country) {
    idInput.value = id;
    nameInput.value = name;
    addressInput.value = address;
    phoneInput.value = phone;
    cityInput.value = city;
    countryInput.value = country;
}

// Deletar contato
async function deleteContact(id) {
    if (!confirm("Are you sure?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadContacts();
}

// Inicial
loadContacts();

console.log("Valor do nameInput:", nameInput.value);