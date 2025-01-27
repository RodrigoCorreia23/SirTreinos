<script>
  import { onMount } from "svelte";
  import io from "socket.io-client";

  let trainings = [];
  let newTraining = {
    name: "",
    location: "",
    date: "",
    type: "",
    duration: "",
    distance: "",
    satisfaction: "",
  };
  let error = null;

  const socket = io("http://localhost:3000");

  // Buscar todos os treinos da API
  const fetchTrainings = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/trainings");
      if (response.ok) {
        trainings = await response.json();
      } else {
        console.error("Erro ao buscar treinos:", response.statusText);
      }
    } catch (err) {
      console.error("Erro de conexão:", err);
    }
  };

  onMount(() => {
    fetchTrainings();

    // Atualizar lista em tempo real
    socket.on("newSharedTraining", (training) => {
      trainings = [training, ...trainings];
    });
  });

  const createTraining = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/api/trainings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(newTraining),
      });

      if (response.ok) {
        const createdTraining = await response.json();
        trainings = [createdTraining, ...trainings];
        socket.emit("shareTraining", createdTraining);

        newTraining = {
          name: "",
          location: "",
          date: "",
          type: "",
          duration: "",
          distance: "",
          satisfaction: "",
        };
      } else {
        alert("Erro ao criar treino.");
      }
    } catch (err) {
      console.error("Erro ao conectar ao servidor:", err);
    }
  };
</script>

<main>
  <h1>Treinos</h1>

  <section>
    <h2>Partilhe o seu Treino</h2>
    <form on:submit|preventDefault={createTraining}>
      <input type="text" bind:value={newTraining.name} placeholder="Nome" required />
      <input type="text" bind:value={newTraining.location} placeholder="Localização" />
      <input type="date" bind:value={newTraining.date} placeholder="Data" required />
      <input type="text" bind:value={newTraining.type} placeholder="Tipo" required />
      <input type="number" bind:value={newTraining.duration} placeholder="Duração" required />
      <input type="number" bind:value={newTraining.distance} placeholder="Distância" required />
      <input type="number" bind:value={newTraining.satisfaction} placeholder="Satisfação" required />
      <button type="submit">Criar Treino</button>
    </form>
  </section>

  <section>
  <h2>Treinos Partilhados pelos Atletas</h2>
  {#if trainings.length > 0}
    <ul>
      {#each trainings as training}
        <li>
          <strong>Nome:</strong> {training.name || "Sem Nome"}<br>
          <strong>Criado por:</strong> {training.createdBy?.username || "Desconhecido"}<br>
          <strong>Localização:</strong> {training.location || "Não informado"}<br>
          <strong>Data:</strong> {training.date ? new Date(training.date).toLocaleDateString() : "Data Inválida"}<br>
          <strong>Tipo:</strong> {training.type || "Não informado"}<br>
          <strong>Duração:</strong> {training.duration || 0} minutos<br>
          <strong>Distância:</strong> {training.distance || 0} km<br>
          <strong>Satisfação:</strong> {training.satisfaction || 0}/5<br>
          <hr>
        </li>
      {/each}
    </ul>
  {:else}
    <p>Não há treinos para exibir.</p>
  {/if}
</section>


  
</main>
