<script>
  import { navigate } from "svelte-routing"; // Importar o método navigate
  let username = "";
  let email = "";
  let password = "";

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        alert("Utilizador registado com sucesso!");
        // Redireciona para a página de login após o registro
        navigate("/login");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Erro ao registar utilizador.");
        console.error("Detalhes do erro:", errorData);
      }
    } catch (err) {
      console.error("Erro ao conectar ao servidor.", err);
      alert("Erro ao conectar ao servidor.");
    }
  };
</script>

<div class="form-container">
  <h1>Registar</h1>
  <form on:submit|preventDefault={handleRegister}>
    <input
      id="username"
      bind:value={username}
      placeholder="Nome de utilizador"
      required
    />
    <input
      id="email"
      type="email"
      bind:value={email}
      placeholder="Email"
      required
    />
    <input
      id="password"
      type="password"
      bind:value={password}
      placeholder="Palavra-passe"
      required
    />
    <button type="submit">Registar</button>
  </form>
</div>
