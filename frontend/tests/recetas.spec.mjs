// tests/navegacionRecetas.spec.js
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Tests de recetas - Navegación, crear, modificar, eliminar, like, favorito...', () => {

  // TEST 1
  test('Hacer scroll, abrir y cerrar el modal de una receta', async ({ page }) => {
    await page.goto(BASE_URL); // Ir a la página de inicio

    // Hacer scroll un poco hacia abajo
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(1000); // Esperar un momento tras hacer scroll

    // Seleccionar la primera receta y hacer clic en ella
    const primeraReceta = page.locator('.test-receta-item').first();
    await primeraReceta.click();

    // Verificar que el modal se ha abierto
    const modal = page.locator('#modalFondo');
    await expect(modal).toBeVisible();

    // Cerrar el modal
    await page.click('.test-cerrar-modal');

    // Verificar que el modal se ha cerrado
    await expect(modal).not.toBeVisible();
  });

  // TEST 2
  test('Ver página de receta, dar y quitar like y favorito', async ({ page }) => {
    // Iniciar sesión
    await page.goto(`${BASE_URL}/login`);
    await page.getByPlaceholder('Correo electrónico').fill('usuario@example.com');
    await page.getByPlaceholder('Contraseña').fill('TestPassword123');
    await page.waitForTimeout(1000);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    await page.waitForURL(`${BASE_URL}/`);
  
    // Seleccionar la primera receta y hacer clic en ella para abrir el modal
    const primeraReceta = page.locator('.test-receta-item').first();
    await primeraReceta.click();
  
    // Verificar que el modal se ha abierto
    const modal = page.locator('#modalFondo');
    await expect(modal).toBeVisible();
  
    // Hacer clic en "Ver receta" para ir a la página de la receta
    await page.click('.test-ver-receta');
  
    // Verificar que hemos navegado a la página de la receta
    await expect(page).toHaveURL(/\/receta\/\d+/);
    await expect(page.locator('.test-titulo-receta')).toBeVisible();
  
    // Dar like a la receta
    const likeButton = page.locator('.test-like-button');
    await expect(likeButton).toHaveText("Like"); // Verificar que el botón inicialmente dice "Like"
    await likeButton.click();
    await expect(likeButton).toHaveText("Quitar Like"); // Verificar que cambió a "Quitar Like"
  
    // Quitar like
    await likeButton.click();
    await expect(likeButton).toHaveText("Like"); // Verificar que volvió a "Like"
  
    // Marcar como favorito
    const favButton = page.locator('.test-favorite-button');
    await expect(favButton).toHaveText("Favorito"); // Verificar que el botón inicialmente dice "Favorito"
    await favButton.click();
    await expect(favButton).toHaveText("Eliminar de Favoritos"); // Verificar que cambió a "Eliminar de Favoritos"
  
    // Quitar de favoritos
    await favButton.click();
    await expect(favButton).toHaveText("Favorito"); // Verificar que volvió a "Favorito"
  });

// TEST 3
test('Crear, editar y eliminar una receta', async ({ page }) => {
  // Iniciar sesión
  await page.goto(`${BASE_URL}/login`);
  await page.getByPlaceholder('Correo electrónico').fill('usuario@example.com');
  await page.getByPlaceholder('Contraseña').fill('TestPassword123');
  await page.waitForTimeout(1000);
  await page.click('button[type="submit"]');
  await page.waitForURL(`${BASE_URL}/`);
  await page.waitForTimeout(4000);

  // CREAR RECETA
  await page.goto(`${BASE_URL}/receta/crear-receta`);
  await page.getByPlaceholder('Nombre de la receta').fill('Receta de Prueba');
  await page.getByPlaceholder('Descripción').fill('Descripción de la receta de prueba');
  await page.getByPlaceholder('Ingredientes').fill('Ingrediente1, Ingrediente2');
  await page.getByPlaceholder('Instrucciones').fill('Paso 1, Paso 2');
  await page.getByPlaceholder('Tiempo en minutos').fill('30');
  await page.waitForTimeout(1000);
  await page.click('button[type="submit"]');


  // Verificar que hemos sido redirigidos a /mis-recetas y la nueva receta está listada
  await page.waitForURL(`${BASE_URL}/mis-recetas`);
  await expect(page.locator('.test-receta-item:has-text("Receta de Prueba")')).toBeVisible();

  // EDITAR RECETA
  const receta = page.locator('.test-receta-item:has-text("Receta de Prueba")');
  await expect(receta).toBeVisible();
  const editarBoton = receta.locator('.test-editar-receta');
  await editarBoton.click();

  // Cambiar el título de la receta
  await page.waitForTimeout(2000);
  await page.locator('.test-editar-nombre input[name="nombre"]').fill('Receta Editada');
  await page.waitForTimeout(1000);
  await page.click('button[type="submit"]');

  // Verificar que el cambio se ha guardado 
  await page.waitForURL(`${BASE_URL}/mis-recetas`);
  await page.waitForTimeout(2000);
  await expect(page.locator('.test-receta-item:has-text("Receta Editada")')).toBeVisible();

  // ELIMINAR RECETA
  const recetaEditada = page.locator('.test-receta-item:has-text("Receta Editada")');
  await expect(recetaEditada).toBeVisible();
  const eliminarBoton = recetaEditada.locator('.test-eliminar-receta');
  await eliminarBoton.click();

  // Esperar que aparezca el modal de confirmación y hacer clic en el botón "Confirmar Eliminación"
  const modalConfirmacion = page.locator('#modalFondo');
  await expect(modalConfirmacion).toBeVisible();
  const confirmarEliminar = page.locator('button:has-text("Confirmar Eliminación")');
  await confirmarEliminar.click();

  // Esperar el mensaje de confirmación en el DOM
  await expect(page.locator('text=Receta eliminada correctamente')).toBeVisible();

  // Esperar que la receta ya no esté en la lista
  await page.waitForTimeout(2000); // Pequeño tiempo de espera extra si es necesario
  await expect(page.locator('.test-receta-item:has-text("Receta Editada")')).not.toBeVisible();

});
});
