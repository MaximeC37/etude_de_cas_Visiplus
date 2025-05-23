module.exports = {
  apps: [
    {
      name: "app",
      script: "./server.js",
      instances: 3,
      exec_mode: "cluster",
      max_memory_restart: "200M",
      error_file: "./logs/err.log",
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};
