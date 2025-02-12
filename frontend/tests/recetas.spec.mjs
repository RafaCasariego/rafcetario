// tests/recetas.spec.js
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Tests de Recetas - Visualización, Creación, Edición, Favoritos y Eliminación', () => {
  
  test('Visualización y navegación de recetas', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    // Suponiendo que cada receta tenga la clase ".receta-item"
    const recetaItem = page.locator('.receta-item');
    await expect(recetaItem.first()).toBeVisible();
    await recetaItem.first().click();
    await page.waitForURL(/\/recetas\/\d+/);
    await expect(page.locator('h1')).toBeVisible();
  });
  
  test('Crear nueva receta', async ({ page }) => {
    // Iniciar sesión
    await page.goto(`${BASE_URL}/login`);
    await page.getByPlaceholder('Correo electrónico').fill('usuario@example.com');
    await page.getByPlaceholder('Contraseña').fill('TestPassword123');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/`);
    
    // Navegar a la sección de crear receta (por ejemplo, /nueva-receta)
    await page.goto(`${BASE_URL}/nueva-receta`);
    await page.getByPlaceholder('Nombre de la receta').fill('Receta de Test');
    await page.getByPlaceholder('Descripción').fill('Descripción de la receta de test');
    // Completar otros campos necesarios si existen (ingredientes, instrucciones, etc.)
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/recetas/);
    await expect(page.locator('text=Receta de Test')).toBeVisible();
  });
  
  test('Editar una receta', async ({ page }) => {
    // Iniciar sesión
    await page.goto(`${BASE_URL}/login`);
    await page.getByPlaceholder('Correo electrónico').fill('usuario@example.com');
    await page.getByPlaceholder('Contraseña').fill('TestPassword123');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/`);
    
    // Navegar a "Mis Recetas"
    await page.goto(`${BASE_URL}/mis-recetas`);
    const recetaItem = page.locator('.receta-item');
    await recetaItem.first().click();
    // Hacer click en el botón "Editar" (asegúrate de que el selector coincide con el de tu app)
    await page.click('button[aria-label="Editar Receta"]');
    // Editar algún campo, por ejemplo, la descripción
    await page.getByPlaceholder('Descripción').fill('Descripción actualizada de la receta de test');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Descripción actualizada de la receta de test')).toBeVisible();
  });
  
  test('Guardar receta en favoritos', async ({ page }) => {
    // Iniciar sesión
    await page.goto(`${BASE_URL}/login`);
    await page.getByPlaceholder('Correo electrónico').fill('usuario@example.com');
    await page.getByPlaceholder('Contraseña').fill('TestPassword123');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/`);
    
    // Navegar a la lista de recetas
    await page.goto(`${BASE_URL}/recetas`);
    const recetaItem = page.locator('.receta-item');
    await recetaItem.first().hover();
    // Suponiendo que existe un botón o icono con aria-label "Agregar a favoritos"
    await page.click('button[aria-label="Agregar a favoritos"]');
    // Comprobar que el icono cambia a un estado activo (por ejemplo, que se agrega una clase o aparece un SVG)
    await expect(recetaItem.first().locator('svg.favorito-activo')).toBeVisible();
  });
  
  test('Eliminar una receta', async ({ page }) => {
    // Iniciar sesión
    await page.goto(`${BASE_URL}/login`);
    await page.getByPlaceholder('Correo electrónico').fill('usuario@example.com');
    await page.getByPlaceholder('Contraseña').fill('TestPassword123');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/`);
    
    // Navegar a "Mis Recetas"
    await page.goto(`${BASE_URL}/mis-recetas`);
    const recetaItem = page.locator('.receta-item');
    await recetaItem.first().hover();
    // Suponiendo que el botón de eliminar tiene aria-label "Eliminar Receta"
    await page.click('button[aria-label="Eliminar Receta"]');
    // Confirmar la eliminación (si hay un diálogo de confirmación)
    await page.click('button', { hasText: 'Confirmar' });
    // Verificar que la receta ya no aparece en la lista (ajusta el selector o el texto según corresponda)
    await expect(recetaItem.first()).not.toContainText('Receta de Test');
  });
});
