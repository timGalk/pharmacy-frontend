const api = {
    async get<T>(url: string): Promise<T> {
        const response = await fetch(url);
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },
    
    async post<T>(url: string, data: any): Promise<T> {
        const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        });
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },
    };

export async function addMedicine(medicine: {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  expirationDate: string;
  image: string;
}) {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:8080/api/medicines', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(medicine),
  });
  if (!response.ok) {
    throw new Error('Failed to add medicine');
  }
  return response.json();
}

export async function getAllMedicines() {
  const response = await fetch('http://localhost:8080/api/medicines', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch medicines');
  }
  return response.json();
}

export async function deleteMedicine(id: string) {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:8080/api/medicines?id=${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete medicine');
  }
  // DELETE requests typically don't return content
  return true;
}

export async function updateMedicine(id: string, medicine: {
  name: string;
  description: string;
  price: number;
  quantity: number;
  expirationDate: string;
  image: string;
}) {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:8080/api/medicines/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(medicine),
  });
  if (!response.ok) {
    throw new Error('Failed to update medicine');
  }
  return response.json();
}