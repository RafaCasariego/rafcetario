// tests/usuarios.spec.js
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://rafcetario-frontend-d0xik1qbf-rafacasariegos-projects.vercel.app';

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
    await page.waitForSelector('div.test-cambiarnombre-modal');

    // Rellenamos el input usando el placeholder "Nuevo Nombre"
    await page.fill('input[placeholder="Nuevo Nombre"]', 'Nombre Deprueba');
    await page.waitForTimeout(2000);
    await page.click('button:has-text("Actualizar Nombre")');

    // Esperamos que aparezca el mensaje de notificación en el DOM
    await page.waitForSelector('div.z-50:has-text("Nombre actualizado")', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // Verificamos que el nombre mostrado en el perfil sea "Nombre Deprueba"
    await expect(page.locator('.test-nombreusuario')).toHaveText('Nombre Deprueba', { timeout: 5000 });

    // Ahora revertimos el cambio para dejarlo en "Usuario"
    await page.click('button.test-cambiarnombre-button');
    await page.waitForSelector('div.test-cambiarnombre-modal');
    await page.fill('input[placeholder="Nuevo Nombre"]', 'Usuario');
    await page.click('button:has-text("Actualizar Nombre")');
    await page.waitForSelector('div.z-50:has-text("Nombre actualizado")', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // Verificamos que el nombre en el perfil vuelva a ser "Usuario"
    await expect(page.locator('.test-nombreusuario')).toHaveText('Usuario', { timeout: 5000 });
  });


  test('Cambiar email de usuario', async ({ page }) => {
    // Hacemos login del usuario
    await page.goto(`${BASE_URL}/login`);
    await page.getByPlaceholder('Correo electrónico').fill('usuario@example.com');
    await page.getByPlaceholder('Contraseña').fill('TestPassword123');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/`);

    // Navegamos hasta la página de editar perfil
    await page.click('button.test-navbar-menu');
    await page.click('a.test-editarperfil-button');
    await page.waitForURL(`${BASE_URL}/perfil`);

    // Iniciamos el proceso para cambiar el email
    await page.click('button:has-text("Cambiar Email")');
    await page.waitForSelector('div:has-text("Cambiar Email")');

    // Rellenamos ambos campos con el nuevo email "usuario@test.com"
    await page.fill('input[placeholder="Nuevo Email"]', 'usuario@test.com');
    await page.fill('input[placeholder="Confirmar Nuevo Email"]', 'usuario@test.com');
    await page.waitForTimeout(2000);
    await page.click('button:has-text("Actualizar Email")');

    // Esperamos a que aparezca el mensaje de notificación
    await page.waitForSelector('div:has-text("Email actualizado")', { timeout: 10000 });
    await page.waitForTimeout(2000);
    
    // Verificamos que el email mostrado en el perfil sea "usuario@test.com"
    await expect(page.locator('.test-emailusuario')).toHaveText('usuario@test.com', { timeout: 5000 });

    // --- Revertimos el cambio para dejarlo en "usuario@example.com" ---
    await page.click('button:has-text("Cambiar Email")');
    await page.waitForSelector('div:has-text("Cambiar Email")');
    await page.fill('input[placeholder="Nuevo Email"]', 'usuario@example.com');
    await page.fill('input[placeholder="Confirmar Nuevo Email"]', 'usuario@example.com');
    await page.waitForTimeout(2000);
    await page.click('button:has-text("Actualizar Email")');

    await page.waitForSelector('div:has-text("Email actualizado")', { timeout: 10000 });
    await page.waitForTimeout(2000);
    
    // Verificamos que el email vuelva a ser "usuario@example.com"
    await expect(page.locator('.test-emailusuario')).toHaveText('usuario@example.com', { timeout: 5000 });
  });


  test('Cambiar contraseña de usuario', async ({ page }) => {
    // 1. Loguearse
    await page.goto(`${BASE_URL}/login`);
    await page.getByPlaceholder('Correo electrónico').fill('usuario@example.com');
    await page.getByPlaceholder('Contraseña').fill('TestPassword123');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/`);

    // 2. Navegar al perfil
    await page.click('button.test-navbar-menu');
    await page.click('a.test-editarperfil-button');
    await page.waitForURL(`${BASE_URL}/perfil`);

    // 3. Abrir modal para cambiar contraseña
    await page.click('button:has-text("Cambiar Contraseña")');
    await page.waitForSelector('div:has-text("Cambiar Contraseña")');

    // 4. Rellenar el formulario para cambiar contraseña a "Password123"
    await page.fill('label.test-contrasena-actual + input', 'TestPassword123');
    await page.fill('label.test-nueva-contrasena + input', 'Password123');
    await page.fill('label.test-confirmar-contrasena + input', 'Password123');
    await page.waitForTimeout(2000);

    // 5. Actualizar contraseña y esperar la notificación en el DOM
    await page.click('button:has-text("Actualizar Contraseña")');
    await page.waitForSelector('div:has-text("Contraseña actualizada")', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // 6. Revertir el cambio: abrir de nuevo el modal
    await page.click('button:has-text("Cambiar Contraseña")');
    await page.waitForSelector('div:has-text("Cambiar Contraseña")');

    // 7. Rellenar el formulario para revertir la contraseña a "TestPassword123"
    await page.fill('label.test-contrasena-actual + input', 'Password123');
    await page.fill('label.test-nueva-contrasena + input', 'TestPassword123');
    await page.fill('label.test-confirmar-contrasena + input', 'TestPassword123');
    await page.waitForTimeout(2000);

    // 8. Actualizar y esperar el mensaje de notificación
    await page.click('button:has-text("Actualizar Contraseña")');
    await page.waitForSelector('div:has-text("Contraseña actualizada")', { timeout: 10000 });
    await page.waitForTimeout(2000);
  });


  test('Registro y eliminación de cuenta', async ({ page }) => {
    // 1. Ir a la página de registro
    await page.goto(`${BASE_URL}/registro`);

    // 2. Rellenar el formulario de registro
    await page.getByPlaceholder('Nombre').fill('Usuario Test');
    const testEmail = `testuser${Date.now()}@example.com`;
    await page.getByPlaceholder('Correo electrónico').fill(testEmail);
    await page.getByPlaceholder('Contraseña').fill('TestPassword123');
    await page.waitForTimeout(1000);
    await page.click('button[type="submit"]');

    // 3. Esperar la redirección a la página principal
    await page.waitForURL(`${BASE_URL}/`);

    // 4. Navegar al perfil
    await page.click('button.test-navbar-menu');
    await page.click('a.test-editarperfil-button');
    await page.waitForURL(`${BASE_URL}/perfil`);

    // 5. Abrir el modal para eliminar la cuenta
    await page.click('button:has-text("Eliminar Cuenta")');

    // 6. Esperar que aparezca el input y llenarlo con "Eliminar mi cuenta"
    const confirmInput = page.getByPlaceholder("Escribe 'Eliminar mi cuenta'");
    await confirmInput.waitFor({ state: 'visible' });
    await confirmInput.fill("Eliminar mi cuenta");
    await page.waitForTimeout(1000);

    // 7. Confirmar la eliminación
    await page.click('button:has-text("Confirmar Eliminación")');

    // 8. Esperar el mensaje de "Cuenta eliminada" y la redirección a la página principal
    await page.waitForSelector('div:has-text("Cuenta eliminada")', { timeout: 10000 });
    await page.waitForTimeout(1500);
    await page.waitForURL(`${BASE_URL}/`, { timeout: 10000 });
  });
});
