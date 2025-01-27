<script>
  import { createEventDispatcher } from "svelte";
  import { navigate } from "svelte-routing";

  let email = "";
  let password = "";

  const dispatch = createEventDispatcher();

  async function handleLogin(event) {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token); // Armazena o token no localStorage
        alert("Login bem-sucedido!");
        dispatch("loginSuccess"); // Atualiza o estado global no App.svelte
        navigate("/main"); // Redireciona para a Main Page
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Erro ao fazer login.");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao conectar ao servidor.");
    }
  }
</script>

<div class="form-container">
  <h1>Login</h1>
  <form on:submit|preventDefault={handleLogin}>
    <label for="email">Email:</label>
    <input id="email" type="email" bind:value={email} required />

    <label for="password">Password:</label>
    <input id="password" type="password" bind:value={password} required />

    <button type="submit">Login</button>
  </form>
</div>
