import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FitAtomic {

  private apiUrl = 'https://raw.githubusercontent.com/AnaHonrubia/APIs/refs/heads/main/alimentos.json';
  private STORAGE_KEY = 'user_profile';

  constructor(private http: HttpClient) { }

  // 1. Obtener alimentos de GitHub
  getAlimentos(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // 2. Guardar datos en LocalStorage
  guardarPerfil(datos: any) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(datos));
  }

  // 3. Leer datos de LocalStorage
  obtenerPerfil() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }
}