import LocalDataManager, { LocalStorageKey } from "./local-data-manager";
import ResManager from "./res-manager";

const MUSIC_PATH = "audios/musics/";
const SOUND_PATH = "audios/soundEffects/"

export class AudioManager {
    private static instance: AudioManager = null;
    private loading_map: Map<string, boolean>;

    private curr_music: string;
    private music_id: number;
    // 音乐开关
    private music_mute: boolean;

    private sound_ids: number[];

    private souid_idsAndKey: Map<string, number> = new Map();

    // 音效开关
    private sound_mute: boolean;

    private storage: LocalDataManager;

    // 音量
    private volume: number = 1;

    private constructor() {
        this.music_id = -1;
        this.sound_ids = [];
        this.loading_map = new Map();
        this.storage = LocalDataManager.getInstance();
    }

    static getInstance(): AudioManager {
        if (!this.instance) {
            this.instance = new AudioManager();
        }
        return this.instance;
    }

    init() {
        // 预加载资源
        cc.resources.preload(`${MUSIC_PATH}`, cc.AudioClip);

        // 音效开关，音乐开关
        let musicIsOpen = Boolean(this.storage.findLocalData(LocalStorageKey.MUSIC_KEY));
        let soundIsOpen = Boolean(this.storage.findLocalData(LocalStorageKey.SOUND_KEY));
        // 本地记录
        if (musicIsOpen) {
            LocalDataManager.getInstance().BG_MUSIC_SWITCH = (musicIsOpen);
        } else {
            this.storage.addLocalData(LocalStorageKey.MUSIC_KEY, LocalDataManager.getInstance().BG_MUSIC_SWITCH);
        }
        if (soundIsOpen) {
            LocalDataManager.getInstance().EFFECT_SOUND_SWITCH = (soundIsOpen);
        } else {
            this.storage.addLocalData(LocalStorageKey.SOUND_KEY, LocalDataManager.getInstance().EFFECT_SOUND_SWITCH);
        }
        this.set_music_mute(!musicIsOpen);
        this.set_sound_mute(!soundIsOpen);
    }

    get _volume() {
        return this.volume;
    }

    set _volume(volume: number) {
        this.volume = volume;
        cc.audioEngine.setVolume(this.music_id, this.volume);
    }

    /** 获取音效id-目前只有主场景背景音效用到了 */
    getMusciID() {
        return this.music_id;
    }

    /**  播放游历背景音- 目前仅用作游历里用 */
    play_BgMusic(path: string, volume: number) {
        ResManager.getInstance().LoadResAudio(MUSIC_PATH + path).then((clip: cc.AudioClip) => {
            cc.audioEngine.setMusicVolume(volume);
            cc.audioEngine.playMusic(clip, true);
        })
    }

    /**  游历停止播放背景音 */
    stop_BgMusic() {
        cc.audioEngine.stopMusic();
    }

    //同时只能播放一个
    play_music(name: string, volume: number) {
        console.log("play_music", name)
        if (this.music_id >= 0) {
            this.stop_music();
        }

        this.curr_music = name;

        if (this.music_mute) {
            console.log("music is mute");
            return;
        }

        const audioAttribute: AudioPlayTask = {
            type: AudioType.Music,
            name: name,
            path: `${MUSIC_PATH}${name}`,
            loop: true,
            volume: volume
        }

        this.load_audioClip_asset(audioAttribute);
    }

    stop_music() {
        if (this.music_id < 0) {
            console.log("no music is playing");
            return;
        }
        cc.audioEngine.stop(this.music_id);
        this.music_id = -1;
    }

    get_music_mute() {
        return this.music_mute;
    }

    set_music_mute(is_mute: boolean) {
        this.music_mute = is_mute;

        if (this.music_id < 0) {
            if (!is_mute && this.curr_music) {
                const music_id = this.curr_music;
                this.curr_music = null;
                this.play_music(music_id, 1);
            }
            return;
        }
        if (is_mute) {
            cc.audioEngine.pause(this.music_id);
        }
        else {
            cc.audioEngine.resume(this.music_id);
        }
    }

    // 暂停音乐
    pauseMusic() {
        cc.audioEngine.pause(this.music_id);
    }

    // 恢复音乐
    resumeMusic() {
        cc.audioEngine.resume(this.music_id);
        cc.audioEngine.setVolume(this.music_id, this.volume);
    }

    get_sound_mute() {
        return this.sound_mute;
    }

    set_sound_mute(is_mute: boolean) {
        this.sound_mute = is_mute;
        this.sound_ids.forEach((sid) => {
            if (is_mute) {
                cc.audioEngine.pause(sid);
            }
            else {
                cc.audioEngine.resume(sid);
            }
        });
    }

    private load_audioClip_asset(task: AudioPlayTask) {
        // console.log("load_audioClip_asset", task.path)
        const path = task.path;
        if (this.loading_map.get(path)) {
            console.log("AI sound is mute is mute 222 ");
            return;
        }
        this.loading_map.set(path, true);
        ResManager.getInstance().LoadResAudio(path, task.external).then((clip: cc.AudioClip) => {
            // console.log("LoadResAudio", path)
            this.loading_map.delete(task.path);
            if (task.type == AudioType.Music && task.name != this.curr_music) {
                console.log("AI sound is mute is mute 333 ");
                return;
            }
            // console.log("play_clip", path)
            this.play_clip(clip, task);
        })
    }


    private play_clip(clip: cc.AudioClip, task: AudioPlayTask) {
        let aid = cc.audioEngine.play(clip, task.loop, task.volume);
        if (task.type == AudioType.Music) {
            this.music_id = aid;
        }
        else if (task.type == AudioType.Sound) {
            this.sound_ids.push(aid);
            this.souid_idsAndKey.set(task.name, aid);
            cc.audioEngine.setFinishCallback(aid, () => {
                this.on_sound_finished(aid);
                // 自动释放
                if (task.isAutoRelease) {
                    clip.decRef();
                }
            });
        }
    }

    private on_sound_finished(aid: number) {
        let idx = this.sound_ids.findIndex((id) => {
            return id == aid;
        });
        if (idx != -1) {
            this.sound_ids.splice(idx, 1);
        }
    }

    play_sound(_path: string, _isAutuoRelease?: boolean, _loop = false) {
        if (this.sound_mute) {
            console.log("AI sound is mute 111");
            return;
        }
        const audioAttribute: AudioPlayTask = {
            type: AudioType.Sound,
            name: _path,
            path: `${SOUND_PATH}${_path}`,
            loop: _loop,
            isAutoRelease: _isAutuoRelease
        }
        this.load_audioClip_asset(audioAttribute);
    }

    stop_sound() {
        this.sound_ids.forEach((sid) => {
            cc.audioEngine.stop(sid);
        });
        this.sound_ids.length = 0;
        this.souid_idsAndKey.clear();
    }

    stop_soundByName(name: string) {
        if (this.souid_idsAndKey.has(name)) {
            cc.audioEngine.stop(this.souid_idsAndKey.get(name));
            this.souid_idsAndKey.delete(name);
        } else {
            cc.log('map中没有这个')
        }
    }

    stopOneSound(sid) {
        this.sound_ids.forEach((v) => {
            if (v === sid) {
                cc.audioEngine.stop(v);
            }
        });
    }

    clear_cache() {
        this.stop_music();
        this.loading_map.clear();
        cc.audioEngine.uncacheAll();
    }
}

enum AudioType {
    Music = 1,
    Sound = 2,
}

interface AudioPlayTask {
    type: AudioType;
    name: string;
    path: string;
    loop: boolean;
    volume?: number;
    external?: boolean;
    isAutoRelease?: boolean;
}
