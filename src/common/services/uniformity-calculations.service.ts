import { Injectable } from '@nestjs/common';

export interface UniformityCoefficients {
  cuc: number; // Coeficiente de Uniformidade de Christiansen
  cud: number; // Coeficiente de Uniformidade de Distribuição
  cue: number; // Coeficiente de Uniformidade Estatístico
}

export interface UniformityClassification {
  valor: number;
  classe: string;
  cor: string;
  descricao: string;
}

@Injectable()
export class UniformityCalculationsService {
  /**
   * Calcula o CUC - Coeficiente de Uniformidade de Christiansen
   * Fórmula: CUC = [1 - Σ|qi - qm| / (n × qm)] × 100
   * 
   * @param vazoes Array de vazões em L/h
   * @returns CUC em porcentagem
   */
  calcularCUC(vazoes: number[]): number {
    if (!vazoes || vazoes.length === 0) {
      throw new Error('Array de vazões vazio');
    }

    const qm = this.calcularMedia(vazoes);
    const somaDesvios = vazoes.reduce(
      (sum, qi) => sum + Math.abs(qi - qm),
      0,
    );
    const cuc = (1 - somaDesvios / (vazoes.length * qm)) * 100;

    return Math.round(cuc * 100) / 100; // 2 casas decimais
  }

  /**
   * Calcula o CUD - Coeficiente de Uniformidade de Distribuição
   * Fórmula: CUD = (q25 / qm) × 100
   * 
   * @param vazoes Array de vazões em L/h
   * @returns CUD em porcentagem
   */
  calcularCUD(vazoes: number[]): number {
    if (!vazoes || vazoes.length === 0) {
      throw new Error('Array de vazões vazio');
    }

    const vazoesOrdenadas = [...vazoes].sort((a, b) => a - b);
    const qm = this.calcularMedia(vazoes);

    // Pegar os 25% menores valores (menor quartil)
    const nQuartil = Math.ceil(vazoes.length * 0.25);
    const menores = vazoesOrdenadas.slice(0, nQuartil);
    const q25 = this.calcularMedia(menores);

    const cud = (q25 / qm) * 100;

    return Math.round(cud * 100) / 100; // 2 casas decimais
  }

  /**
   * Calcula o CUE - Coeficiente de Uniformidade Estatístico
   * Fórmula: CUE = [1 - (S / qm)] × 100
   * Onde S = desvio-padrão
   * 
   * @param vazoes Array de vazões em L/h
   * @returns CUE em porcentagem
   */
  calcularCUE(vazoes: number[]): number {
    if (!vazoes || vazoes.length === 0) {
      throw new Error('Array de vazões vazio');
    }

    const qm = this.calcularMedia(vazoes);
    const desvioPadrao = this.calcularDesvioPadrao(vazoes, qm);

    const cue = (1 - desvioPadrao / qm) * 100;

    return Math.round(cue * 100) / 100; // 2 casas decimais
  }

  /**
   * Calcula todos os 3 coeficientes de uniformidade
   * 
   * @param vazoes Array de vazões em L/h
   * @returns Objeto com CUC, CUD e CUE
   */
  calcularCoeficientes(vazoes: number[]): UniformityCoefficients {
    return {
      cuc: this.calcularCUC(vazoes),
      cud: this.calcularCUD(vazoes),
      cue: this.calcularCUE(vazoes),
    };
  }

  /**
   * Classifica o CUC conforme Mantovani (2002)
   * < 60% = INACEITÁVEL
   * 60-70% = RUIM
   * 70-80% = RAZOÁVEL
   * 80-90% = BOM
   * > 90% = EXCELENTE
   */
  classificarCUC(cuc: number): UniformityClassification {
    if (cuc < 60) {
      return {
        valor: cuc,
        classe: 'INACEITÁVEL',
        cor: '#EF4444', // red-500
        descricao: 'Sistema com uniformidade inadequada. Necessita correção urgente.',
      };
    }
    if (cuc < 70) {
      return {
        valor: cuc,
        classe: 'RUIM',
        cor: '#F97316', // orange-500
        descricao: 'Sistema com baixa uniformidade. Requer manutenção.',
      };
    }
    if (cuc < 80) {
      return {
        valor: cuc,
        classe: 'RAZOÁVEL',
        cor: '#EAB308', // yellow-500
        descricao: 'Sistema com uniformidade regular. Pode ser melhorado.',
      };
    }
    if (cuc < 90) {
      return {
        valor: cuc,
        classe: 'BOM',
        cor: '#3B82F6', // blue-500
        descricao: 'Sistema com boa uniformidade.',
      };
    }
    return {
      valor: cuc,
      classe: 'EXCELENTE',
      cor: '#10B981', // green-500
      descricao: 'Sistema com excelente uniformidade!',
    };
  }

  /**
   * Classifica o CUD conforme Bralts (1986)
   * < 70% = RUIM
   * 70-80% = REGULAR
   * 80-90% = BOM
   * > 90% = EXCELENTE
   */
  classificarCUD(cud: number): UniformityClassification {
    if (cud < 70) {
      return {
        valor: cud,
        classe: 'RUIM',
        cor: '#EF4444', // red-500
        descricao: 'Distribuição ruim. Necessita correção.',
      };
    }
    if (cud < 80) {
      return {
        valor: cud,
        classe: 'REGULAR',
        cor: '#EAB308', // yellow-500
        descricao: 'Distribuição regular. Pode ser melhorada.',
      };
    }
    if (cud < 90) {
      return {
        valor: cud,
        classe: 'BOM',
        cor: '#3B82F6', // blue-500
        descricao: 'Boa distribuição de água.',
      };
    }
    return {
      valor: cud,
      classe: 'EXCELENTE',
      cor: '#10B981', // green-500
      descricao: 'Excelente distribuição de água!',
    };
  }

  /**
   * Classifica o CUE conforme Bralts e Kesner (1983)
   * < 60% = INACEITÁVEL
   * 60-70% = RUIM
   * 70-80% = RAZOÁVEL
   * 80-90% = MUITO BOM
   * > 90% = EXCELENTE
   */
  classificarCUE(cue: number): UniformityClassification {
    if (cue < 60) {
      return {
        valor: cue,
        classe: 'INACEITÁVEL',
        cor: '#EF4444', // red-500
        descricao: 'Uniformidade estatística inadequada.',
      };
    }
    if (cue < 70) {
      return {
        valor: cue,
        classe: 'RUIM',
        cor: '#F97316', // orange-500
        descricao: 'Uniformidade estatística ruim.',
      };
    }
    if (cue < 80) {
      return {
        valor: cue,
        classe: 'RAZOÁVEL',
        cor: '#EAB308', // yellow-500
        descricao: 'Uniformidade estatística razoável.',
      };
    }
    if (cue < 90) {
      return {
        valor: cue,
        classe: 'MUITO BOM',
        cor: '#3B82F6', // blue-500
        descricao: 'Muito boa uniformidade estatística.',
      };
    }
    return {
      valor: cue,
      classe: 'EXCELENTE',
        cor: '#10B981', // green-500
      descricao: 'Excelente uniformidade estatística!',
    };
  }

  /**
   * Calcula a vazão em L/h a partir do volume (ml) e tempo (segundos)
   * Fórmula: Q = (Volume / 1000) / (Tempo / 3600)
   * 
   * @param volumeMl Volume coletado em mililitros
   * @param tempoSeg Tempo de coleta em segundos
   * @returns Vazão em L/h
   */
  calcularVazao(volumeMl: number, tempoSeg: number): number {
    if (tempoSeg === 0) {
      throw new Error('Tempo não pode ser zero');
    }

    const volumeLitros = volumeMl / 1000;
    const tempoHoras = tempoSeg / 3600;
    const vazao = volumeLitros / tempoHoras;

    return Math.round(vazao * 100) / 100; // 2 casas decimais
  }

  // ==================== FUNÇÕES AUXILIARES ====================

  private calcularMedia(valores: number[]): number {
    const soma = valores.reduce((acc, val) => acc + val, 0);
    return soma / valores.length;
  }

  private calcularDesvioPadrao(valores: number[], media: number): number {
    const variancia =
      valores.reduce((sum, val) => sum + Math.pow(val - media, 2), 0) /
      valores.length;
    return Math.sqrt(variancia);
  }
}
