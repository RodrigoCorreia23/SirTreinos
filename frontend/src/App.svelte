<script>
  import { Router, Route, Link, navigate } from "svelte-routing";
  import Home from "./routes/Home.svelte";
  import Login from "./routes/Login.svelte";
  import Register from "./routes/Register.svelte";
  import Profile from "./routes/Profile.svelte";
  import MainPage from "./routes/MainPage.svelte";
  import NewTraining from "./routes/NewTraining.svelte"; 
  import { onMount } from "svelte";

  let isAuthenticated = false;
  let isLoading = true;

  const checkAuthentication = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      isAuthenticated = false;
      isLoading = false;
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/profile", {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        isAuthenticated = true;
      } else {
        isAuthenticated = false;
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      isAuthenticated = false;
      localStorage.removeItem("token");
    } finally {
      isLoading = false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove o token do armazenamento
    isAuthenticated = false; // Atualiza o estado para não autenticado
    navigate("/login"); // Redireciona para a página de login
  };

  onMount(() => {
    checkAuthentication();
  });
</script>

<Router>
  <header>
    <nav>
      {#if isLoading}
        <span>Carregando...</span>
      {:else if isAuthenticated}
        <Link to="/main" class="nav-link">🏠 Página Principal</Link>
        <Link to="/profile" class="nav-link">👤 Ver Perfil</Link>
        <Link to="/new-training" class="nav-link">✍️ Criar Treino</Link>
        <button on:click={handleLogout} class="nav-link logout-btn">🔓 Logout</button>
      {:else}
        <Link to="/" class="nav-link">🏠 Home</Link>
        <Link to="/login" class="nav-link">🔐 Login</Link>
        <Link to="/register" class="nav-link">✍️ Registar</Link>
      {/if}
    </nav>
  </header>

  <main>
    <Route path="/" component={Home} />
    <Route path="/login" let:props>
      <Login on:loginSuccess={() => (isAuthenticated = true)} {...props} />
    </Route>
    <Route path="/register" component={Register} />
    <Route path="/profile" component={Profile} />
    <Route path="/main" component={MainPage} />
    <Route path="/new-training" component={NewTraining} />
  </main>
</Router>