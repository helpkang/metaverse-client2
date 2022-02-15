//##################오케스트레이션########################
export class Orchestration {
  public static main(): void {
    const orchestration: Orchestration = new Orchestration();
    orchestration.start();
  }

  start(): void {
    this.setupFactory();
    const pfactory = new PFactoryRegister().getPFactory();
    const pland = pfactory.createPLand();
    console.log('pland:', pland);
  }

  private setupFactory() {
    PFactoryRegister.register(new PFactoryImpl());
  }
}

//###############프리젠테이션 팩토리#####################
export interface PFactory {
  createPLand(): PLand;
  createPPlayer(): PPlayer;
  createPChat(): PChat;
  createPLayer(): PLayer;
}

export class PFactoryRegister {
  getPFactory(): PFactory {
    return PFactoryRegister.pfactory;
  }

  static register(pfactory: PFactory): void {
    PFactoryRegister.pfactory = pfactory;
  }

  private static pfactory: PFactory;
}

class PFactoryImpl implements PFactory {
  createPLand(): PLand {
    return new PLandImpl();
  }
  createPPlayer(): PPlayer {
    throw new Error("Method not implemented.");
  }
  createPChat(): PChat {
    throw new Error("Method not implemented.");
  }
  createPLayer(): PLayer {
    throw new Error("Method not implemented.");
  }
  create(): PFactory {
    throw new Error("Method not implemented.");
  }
}

//###############프리젠테이션 설계###############
export interface PLand {}
export interface PPlayer {}
export interface PChat {}
export interface PLayer {}

//###############프리젠테이션 구현###############
export class PLandImpl implements PLand {}
export interface PPlayer {}
export interface PChat {}
export interface PLayer {}

//###############서비스 설계####################
export interface SLand {}
export interface SPlayer {}
export interface SChat {}
export interface SLayer {}

//###############도메인 설계####################
export interface DLand {}
export interface DPlayer {}
export interface DChat {}
export interface DLayer {}

//###############테트워크 설계####################
export interface NLand {}
export interface NPlayer {}
export interface NChat {}
export interface NLayer {}

//###############wrapper factory####################
export interface DrawWrapperFactory {
  createDrawWrapper(): DrawWrapper;
}

export class DrawWrapperFactoryImpl implements DrawWrapperFactory {
  constructor(private canvas: HTMLCanvasElement) {}

  createDrawWrapper(): DrawWrapper {
    throw new Error("Method not implemented.");
  }
}

//###############테스트를 원할하게 하기위한 wrapper##################
export interface DrawWrapper {
  draw(): void;
}

export interface DrawWrapperFactory {
  createDrawWrapper(): DrawWrapper;
}
