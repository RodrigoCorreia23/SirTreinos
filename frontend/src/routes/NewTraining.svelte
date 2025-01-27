<script>
  import { onMount } from "svelte";
  import io from "socket.io-client";

  let createdTrainings = [];
  let newTraining = { name: "", location: "", date: "", time: "", type: "" };
  let error = null;

  const socket = io("http://localhost:3000");

  // Buscar treinos ao carregar a página
  const fetchTrainings = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/created-trainings");
      if (response.ok) {
        createdTrainings = await response.json();
      } else {
        console.error("Erro ao buscar treinos:", response.statusText);
      }
    } catch (err) {
      console.error("Erro de conexão:", err);
    }
  };

  onMount(() => {
    fetchTrainings(); // Busca treinos salvos no backend
    socket.on("newSharedTraining", (training) => {
      createdTrainings = [training, ...createdTrainings];
    });
  });

  const createTraining = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/api/created-trainings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(newTraining),
      });

      if (response.ok) {
        const createdTraining = await response.json();
        createdTrainings = [createdTraining, ...createdTrainings];
        socket.emit("shareTraining", createdTraining);
        newTraining = { name: "", location: "", date: "", time: "", type: "" };
      } else {
        const { message } = await response.json();
        error = message || "Erro ao criar treino.";
      }
    } catch (err) {
      error = "Erro ao conectar ao servidor.";
      console.error(err);
    }
  };
</script>

<main>
  <h1>Criar Novo Treino</h1>

  <form on:submit|preventDefault={createTraining}>
    <input type="text" bind:value={newTraining.name} placeholder="Nome" required />
    <input type="text" bind:value={newTraining.location} placeholder="Localização" required />
    <input type="date" bind:value={newTraining.date} placeholder="Data" required />
    <input type="time" bind:value={newTraining.time} placeholder="Hora" required />
    <input type="text" bind:value={newTraining.type} placeholder="Tipo de Treino" required />
    <button type="submit">Criar Treino</button>
  </form>

  {#if error}
    <p style="color: red;">{error}</p>
  {/if}

  <section>
    <h2>Treinos Criados</h2>
    {#if createdTrainings.length > 0}
      <ul>
        {#each createdTrainings as training}
          <li>
            <strong>Nome:</strong> {training.name}<br />
            <strong>Localização:</strong> {training.location}<br />
            <strong>Data:</strong> {training.date ? new Date(training.date).toLocaleDateString() : "Data Inválida"}<br />
            <strong>Hora:</strong> {training.time}<br />
            <strong>Tipo:</strong> {training.type}<br />
          </li>
        {/each}
      </ul>
    {:else}
      <p>Nenhum treino criado ainda.</p>
    {/if}
  </section>
</main>
