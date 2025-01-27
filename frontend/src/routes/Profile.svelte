<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";

  let user = null;
  let trainings = [];
  let error = null;

  onMount(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("É preciso estar logado para acessar esta página.");
      navigate("/login");
      return;
    }

    try {
      // Obter dados do perfil do utilizador
      const profileResponse = await fetch("http://localhost:3000/api/auth/profile", {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      if (profileResponse.ok) {
        user = await profileResponse.json();
      } else {
        alert("Erro ao carregar perfil.");
        navigate("/login");
        return;
      }

      // Obter treinos criados pelo utilizador
      const trainingsResponse = await fetch("http://localhost:3000/api/trainings/my-trainings", {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      if (trainingsResponse.ok) {
        trainings = await trainingsResponse.json();
      } else {
        console.error("Erro ao carregar treinos:", await trainingsResponse.json());
      }
    } catch (err) {
      console.error("Erro ao conectar ao servidor:", err);
      error = "Erro ao conectar ao servidor.";
    }
  });
</script>

<main>
  {#if user}
    <h1>Perfil de {user.username}</h1>
    <p>Email: {user.email}</p>
    <p>Registrado em: {new Date(user.createdAt).toLocaleDateString()}</p>

    <section>
      <h2>Os teus Treinos</h2>
      {#if trainings.length > 0}
        <ul>
          {#each trainings as training}
            <li>
              <strong>Nome:</strong> {training.name || "Sem Nome"}<br>
              <strong>Data:</strong> {training.date ? new Date(training.date).toLocaleDateString() : "Data Inválida"}<br>
              <strong>Localização:</strong> {training.location || "Não informado"}<br>
              <strong>Tipo:</strong> {training.type || "Não informado"}<br>
              <strong>Duração:</strong> {training.duration || 0} minutos<br>
              <strong>Distância:</strong> {training.distance || 0} km<br>
              <strong>Satisfação:</strong> {training.satisfaction || 0}/5<br>
              <hr>
            </li>
          {/each}
        </ul>
      {:else}
        <p>Você ainda não criou nenhum treino.</p>
      {/if}
    </section>
  {:else if error}
    <p>{error}</p>
  {:else}
    <p>Carregando...</p>
  {/if}
</main>
