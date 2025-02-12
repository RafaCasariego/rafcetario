// tests/usuarios.spec.js
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Tests de Usuarios - Registro, Login, Logout y Validaciones', () => {
  
  test('Registro de usuario exitoso', async ({ page }) => {
    await page.goto(`${BASE_URL}/registro`);
    await page.getByPlaceholder('Nombre').fill('Usuario Test');
    const testEmail = `testuser${Date.now()}@example.com`;
    await page.getByPlaceholder('Correo electrónico').fill(testEmail);
    await page.getByPlaceholder('Contraseña').fill('TestPassword123');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/`);
    await expect(page.locator('button.test-navbar-menu')).toBeVisible();
  });
  
  test('Login de usuario exitoso', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    // Usa un usuario de prueba ya registrado (asegúrate de que exista este usuario)
    await page.getByPlaceholder('Correo electrónico').fill('usuario@example.com');
    await page.getByPlaceholder('Contraseña').fill('TestPassword123');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/`);
    await expect(page.locator('button.test-navbar-menu')).toBeVisible();
  });
  
  test('Logout de usuario exitoso', async ({ page }) => {
    // Iniciar sesión previamente
    await page.goto(`${BASE_URL}/login`);
    await page.getByPlaceholder('Correo electrónico').fill('usuario@example.com');
    await page.getByPlaceholder('Contraseña').fill('TestPassword123');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/`);
    
    // Abrir el dropdown del perfil y cerrar sesión
    const perfilBtn = page.locator('button.test-navbar-menu');
    await perfilBtn.click();
    const cerrarSesionBtn = page.locator('.test-navbar-dropdown')
      .locator('button.test-cerrarsesion-button');
    await cerrarSesionBtn.click();
    await page.waitForURL(`${BASE_URL}/`);
    await expect(page.locator('a.test-iniciarsesion-button')).toBeVisible();
  });
  
  test('Login con credenciales incorrectas o campos en blanco', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // Caso: Campos vacíos
    await page.getByPlaceholder('Correo electrónico').fill('');
    await page.getByPlaceholder('Contraseña').fill('');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Por favor, ingresa tu correo electrónico')).toBeVisible();
    
    // Caso: Credenciales incorrectas
    await page.getByPlaceholder('Correo electrónico').fill('usuario_incorrecto@example.com');
    await page.getByPlaceholder('Contraseña').fill('CredencialIncorrecta');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Credenciales incorrectas')).toBeVisible();
  });
  
  test('Registro incorrecto: email inválido y duplicado', async ({ page }) => {
    // Caso: Email en formato incorrecto
    await page.goto(`${BASE_URL}/registro`);
    await page.getByPlaceholder('Nombre').fill('Usuario Test');
    
    // Obtén el input de email y rellénalo con un valor inválido
    const emailInput = page.getByPlaceholder('Correo electrónico');
    await emailInput.fill('email-invalido');
    
    await page.getByPlaceholder('Contraseña').fill('TestPassword123');
    await page.click('button[type="submit"]');
  
    // Obtener el mensaje de validación nativo del input de email
    const validationMessage = await emailInput.evaluate(el => el.validationMessage);
    expect(validationMessage).toContain('Incluye un signo "@"');
    
    // Caso: Email duplicado

    await page.goto(`${BASE_URL}/registro`);
    await page.getByPlaceholder('Nombre').fill('Usuario Test 2');
    await page.getByPlaceholder('Correo electrónico').fill('usuario@example.com');
    await page.getByPlaceholder('Contraseña').fill('TestPassword123');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Ese email ya está en uso')).toBeVisible();
  });
});

test('Cambiar nombre de usuario', async ({ page }) => {
  // Hacemos login del usuario al que vamos a cambiar el nombre
  await page.goto(`${BASE_URL}/login`);
  await page.getByPlaceholder('Correo electrónico').fill('usuario@example.com');
  await page.getByPlaceholder('Contraseña').fill('TestPassword123');
  await page.click('button[type="submit"]');
  await page.waitForURL(`${BASE_URL}/`);

  // Navegamos hasta la página de editar perfil
  await page.click('button.test-navbar-menu');
  await page.click('a.test-editarperfil-button');
  await page.waitForURL(`${BASE_URL}/perfil`);

  // Iniciamos el proceso para cambiar el nombre
  await page.click('button.test-cambiarnombre-button');
  
  // Esperamos que aparezca la modal para cambiar el nombre
  await page.waitForSelector('div.test-cambiarnombre-modal');
  
  // Usamos evaluate para establecer el valor del input y disparar el evento input
  await page.evaluate(() => {
    const input = document.querySelector('input[placeholder="Nuevo Nombre"]');
    if (input) {
      input.value = 'Nombre Deprueba';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });

  // Verificamos que el input tenga el valor "Nombre Deprueba"
  await expect(page.locator('input[placeholder="Nuevo Nombre"]')).toHaveValue('Nombre Deprueba');

  // Configuramos el listener para el alert que se muestra al actualizar
  page.once('dialog', async dialog => {
    expect(dialog.message()).toBe('Nombre actualizado');
    await dialog.accept();
  });

  // Hacemos click en el botón de "Actualizar Nombre"
  await page.click('button:has-text("Actualizar Nombre")');

  // Esperamos un poco para que se refleje el cambio
  await page.waitForTimeout(2000);

  // Verificamos que el nombre mostrado en el perfil sea "Nombre Deprueba"
  await expect(page.locator('.test-nombreusuario')).toHaveText('Nombre Deprueba', { timeout: 5000 });
});






//Añadir test de: 

/*
EDITAR PERFIL:
1 - CAMBIAR NOMBRE check
2 - CAMBIAR EMAIL
3 - CAMBIAR CONTRASEÑA
4 - ELIMINAR CUENTA
*/