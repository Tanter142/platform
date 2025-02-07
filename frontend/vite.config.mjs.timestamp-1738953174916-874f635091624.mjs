// vite.config.mjs
import { defineConfig } from "file:///C:/Users/edikr/OneDrive/%D0%A0%D0%B0%D0%B1%D0%BE%D1%87%D0%B8%D0%B9%20%D1%81%D1%82%D0%BE%D0%BB/lms-develop/frontend/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/edikr/OneDrive/%D0%A0%D0%B0%D0%B1%D0%BE%D1%87%D0%B8%D0%B9%20%D1%81%D1%82%D0%BE%D0%BB/lms-develop/frontend/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import frappeui from "file:///C:/Users/edikr/OneDrive/%D0%A0%D0%B0%D0%B1%D0%BE%D1%87%D0%B8%D0%B9%20%D1%81%D1%82%D0%BE%D0%BB/lms-develop/frontend/node_modules/frappe-ui/vite.js";
var __vite_injected_original_dirname = "C:\\Users\\edikr\\OneDrive\\\u0420\u0430\u0431\u043E\u0447\u0438\u0439 \u0441\u0442\u043E\u043B\\lms-develop\\frontend";
var vite_config_default = defineConfig({
  plugins: [
    frappeui(),
    vue({
      script: {
        defineModel: true,
        propsDestructure: true
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "src"),
      "tailwind.config.js": path.resolve(__vite_injected_original_dirname, "tailwind.config.js")
    }
  },
  build: {
    outDir: `../lms/public/frontend`,
    emptyOutDir: true,
    commonjsOptions: {
      include: [/tailwind.config.js/, /node_modules/]
    },
    sourcemap: true,
    target: "es2015",
    rollupOptions: {
      output: {
        manualChunks: {
          "frappe-ui": ["frappe-ui"]
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      "feather-icons",
      "showdown",
      "engine.io-client",
      "tailwind.config.js"
    ]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZWRpa3JcXFxcT25lRHJpdmVcXFxcXHUwNDIwXHUwNDMwXHUwNDMxXHUwNDNFXHUwNDQ3XHUwNDM4XHUwNDM5IFx1MDQ0MVx1MDQ0Mlx1MDQzRVx1MDQzQlxcXFxsbXMtZGV2ZWxvcFxcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZWRpa3JcXFxcT25lRHJpdmVcXFxcXHUwNDIwXHUwNDMwXHUwNDMxXHUwNDNFXHUwNDQ3XHUwNDM4XHUwNDM5IFx1MDQ0MVx1MDQ0Mlx1MDQzRVx1MDQzQlxcXFxsbXMtZGV2ZWxvcFxcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy5tanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2VkaWtyL09uZURyaXZlLyVEMCVBMCVEMCVCMCVEMCVCMSVEMCVCRSVEMSU4NyVEMCVCOCVEMCVCOSUyMCVEMSU4MSVEMSU4MiVEMCVCRSVEMCVCQi9sbXMtZGV2ZWxvcC9mcm9udGVuZC92aXRlLmNvbmZpZy5tanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IGZyYXBwZXVpIGZyb20gJ2ZyYXBwZS11aS92aXRlJ1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcblx0cGx1Z2luczogW1xuXHRcdGZyYXBwZXVpKCksXG5cdFx0dnVlKHtcblx0XHRcdHNjcmlwdDoge1xuXHRcdFx0XHRkZWZpbmVNb2RlbDogdHJ1ZSxcblx0XHRcdFx0cHJvcHNEZXN0cnVjdHVyZTogdHJ1ZSxcblx0XHRcdH0sXG5cdFx0fSksXG5cdF0sXG5cdHJlc29sdmU6IHtcblx0XHRhbGlhczoge1xuXHRcdFx0J0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyksXG5cdFx0XHQndGFpbHdpbmQuY29uZmlnLmpzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3RhaWx3aW5kLmNvbmZpZy5qcycpLFxuXHRcdH0sXG5cdH0sXG5cdGJ1aWxkOiB7XG5cdFx0b3V0RGlyOiBgLi4vbG1zL3B1YmxpYy9mcm9udGVuZGAsXG5cdFx0ZW1wdHlPdXREaXI6IHRydWUsXG5cdFx0Y29tbW9uanNPcHRpb25zOiB7XG5cdFx0XHRpbmNsdWRlOiBbL3RhaWx3aW5kLmNvbmZpZy5qcy8sIC9ub2RlX21vZHVsZXMvXSxcblx0XHR9LFxuXHRcdHNvdXJjZW1hcDogdHJ1ZSxcblx0XHR0YXJnZXQ6ICdlczIwMTUnLFxuXHRcdHJvbGx1cE9wdGlvbnM6IHtcblx0XHRcdG91dHB1dDoge1xuXHRcdFx0XHRtYW51YWxDaHVua3M6IHtcblx0XHRcdFx0XHQnZnJhcHBlLXVpJzogWydmcmFwcGUtdWknXSxcblx0XHRcdFx0fSxcblx0XHRcdH0sXG5cdFx0fSxcblx0fSxcblx0b3B0aW1pemVEZXBzOiB7XG5cdFx0aW5jbHVkZTogW1xuXHRcdFx0J2ZlYXRoZXItaWNvbnMnLFxuXHRcdFx0J3Nob3dkb3duJyxcblx0XHRcdCdlbmdpbmUuaW8tY2xpZW50Jyxcblx0XHRcdCd0YWlsd2luZC5jb25maWcuanMnLFxuXHRcdF0sXG5cdH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzYSxTQUFTLG9CQUFvQjtBQUNuYyxPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sY0FBYztBQUhyQixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMzQixTQUFTO0FBQUEsSUFDUixTQUFTO0FBQUEsSUFDVCxJQUFJO0FBQUEsTUFDSCxRQUFRO0FBQUEsUUFDUCxhQUFhO0FBQUEsUUFDYixrQkFBa0I7QUFBQSxNQUNuQjtBQUFBLElBQ0QsQ0FBQztBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNSLE9BQU87QUFBQSxNQUNOLEtBQUssS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQSxNQUNsQyxzQkFBc0IsS0FBSyxRQUFRLGtDQUFXLG9CQUFvQjtBQUFBLElBQ25FO0FBQUEsRUFDRDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ04sUUFBUTtBQUFBLElBQ1IsYUFBYTtBQUFBLElBQ2IsaUJBQWlCO0FBQUEsTUFDaEIsU0FBUyxDQUFDLHNCQUFzQixjQUFjO0FBQUEsSUFDL0M7QUFBQSxJQUNBLFdBQVc7QUFBQSxJQUNYLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNkLFFBQVE7QUFBQSxRQUNQLGNBQWM7QUFBQSxVQUNiLGFBQWEsQ0FBQyxXQUFXO0FBQUEsUUFDMUI7QUFBQSxNQUNEO0FBQUEsSUFDRDtBQUFBLEVBQ0Q7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNiLFNBQVM7QUFBQSxNQUNSO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRDtBQUFBLEVBQ0Q7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
