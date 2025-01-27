<script>
  export const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: token,
        },
      });
      localStorage.removeItem("token"); // Remove o token do localStorage
      window.location.href = "/"; // Redireciona para a home
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };
</script>
