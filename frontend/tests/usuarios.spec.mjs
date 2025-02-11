// tests/usuarios.spec.js
import { test, expect } from '@playwright/test';

test.describe('Tests de Usuarios - Registro, Login, Logout y Validaciones', () => {
  
  test('Registro de usuario exitoso', async ({ page }) => {
    await page.goto('https://rafcetario-frontend-4d9llpz1b-rafacasariegos-projects.vercel.app/registro');
    await page.getByPlaceholder('Nombre').fill('Usuario Test');
    const testEmail = `testuser${Date.now()}@example.com`;
    await page.getByPlaceholder('Correo electrónico').fill(testEmail);
    await page.getByPlaceholder('Contraseña').fill('TestPassword123');
    await page.click('button[type="submit"]');
    await page.waitForURL('https://rafcetario-frontend-4d9llpz1b-rafacasariegos-projects.vercel.app/');
    await expect(page.locator('button.bg-gray-200')).toBeVisible();
  });
  
  test('Login de usuario exitoso', async ({ page }) => {
    await page.goto('https://rafcetario-frontend-4d9llpz1b-rafacasariegos-projects.vercel.app/login');
    // Usa un usuario de prueba ya registrado (asegúrate de que exista este usuario)
    await page.getByPlaceholder('Correo electrónico').fill('usuario@example.com');
    await page.getByPlaceholder('Contraseña').fill('TestPassword123');
    await page.click('button[type="submit"]');
    await page.waitForURL('https://rafcetario-frontend-4d9llpz1b-rafacasariegos-projects.vercel.app/');
    await expect(page.locator('button.bg-gray-200')).toBeVisible();
  });
  
  test('Logout de usuario exitoso', async ({ page }) => {
    // Iniciar sesión previamente
    await page.goto('https://rafcetario-frontend-4d9llpz1b-rafacasariegos-projects.vercel.app/login');
    await page.getByPlaceholder('Correo electrónico').fill('usuario@example.com');
    await page.getByPlaceholder('Contraseña').fill('TestPassword123');
    await page.click('button[type="submit"]');
    await page.waitForURL('https://rafcetario-frontend-4d9llpz1b-rafacasariegos-projects.vercel.app/');
    
    // Abrir el dropdown del perfil y cerrar sesión
    const perfilBtn = page.locator('button.bg-gray-200');
    await perfilBtn.click();
    const cerrarSesionBtn = page.locator('div.absolute.right-0.mt-3')
      .locator('button', { hasText: 'Cerrar Sesión' });
    await cerrarSesionBtn.click();
    await page.waitForURL('https://rafcetario-frontend-4d9llpz1b-rafacasariegos-projects.vercel.app/login');
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
  
  test('Login con credenciales incorrectas o campos en blanco', async ({ page }) => {
    await page.goto('https://rafcetario-frontend-4d9llpz1b-rafacasariegos-projects.vercel.app/login');
    
    // Caso: Campos vacíos
    await page.getByPlaceholder('Correo electrónico').fill('');
    await page.getByPlaceholder('Contraseña').fill('');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=El correo electrónico es requerido')).toBeVisible();
    
    // Caso: Credenciales incorrectas
    await page.getByPlaceholder('Correo electrónico').fill('usuario_incorrecto@example.com');
    await page.getByPlaceholder('Contraseña').fill('CredencialIncorrecta');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Credenciales incorrectas')).toBeVisible();
  });
  
  test('Registro incorrecto: email inválido y duplicado', async ({ page }) => {
    // Caso: Email en formato incorrecto
    await page.goto('https://rafcetario-frontend-4d9llpz1b-rafacasariegos-projects.vercel.app/registro');
    await page.getByPlaceholder('Nombre').fill('Usuario Test');
    await page.getByPlaceholder('Correo electrónico').fill('email-invalido');
    await page.getByPlaceholder('Contraseña').fill('TestPassword123');
    await page.click('button[type="submit"]');
    await expect(page.locator('text="@"')).toBeVisible();
    
    // Caso: Email duplicado
    const duplicateEmail = 'duplicado@example.com';
    // Primer registro exitoso con duplicateEmail
    await page.goto('https://rafcetario-frontend-4d9llpz1b-rafacasariegos-projects.vercel.app/registro');
    await page.getByPlaceholder('Nombre').fill('Usuario Test');
    await page.getByPlaceholder('Correo electrónico').fill(duplicateEmail);
    await page.getByPlaceholder('Contraseña').fill('TestPassword123');
    await page.click('button[type="submit"]');
    await page.waitForURL('https://rafcetario-frontend-4d9llpz1b-rafacasariegos-projects.vercel.app/');
    
    // Intentar registrar de nuevo con el mismo email
    await page.goto('https://rafcetario-frontend-4d9llpz1b-rafacasariegos-projects.vercel.app/registro');
    await page.getByPlaceholder('Nombre').fill('Usuario Test 2');
    await page.getByPlaceholder('Correo electrónico').fill(duplicateEmail);
    await page.getByPlaceholder('Contraseña').fill('TestPassword123');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=El email ya está en uso')).toBeVisible();
  });
});
