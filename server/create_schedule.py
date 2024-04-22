import pandas as pd
import matplotlib.pyplot as plt
from create_vertex import create_graph_and_apply_coloring

def create_schedule_dataframe(G, colors):
    time_slots = ["8:00 - 9:30", "9:45 - 11:15", "11:30 - 13:00", "13:30 - 15:00", "15:15 - 16:45", "17:00 - 18:30", "18:45 - 20:15"]
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    groups = list({node[0] for node in G.nodes()})
    multi_index = pd.MultiIndex.from_product([days, time_slots], names=['Day', 'Time'])
    df = pd.DataFrame(index=multi_index, columns=groups).fillna('')
    num_time_slots = len(time_slots)
    for node, color in colors.items():
        group, course, course_type, teacher, office, _, _ = node
        day_index = color // 4
        time_index = color % num_time_slots
        if day_index < len(days):
            day = days[day_index]
            time_slot = time_slots[time_index]
            course_details = f"{course_type} {course}\n{teacher}\n{office}"
            if df.at[(day, time_slot), group] == '':
                df.at[(day, time_slot), group] = course_details
            else:
                df.at[(day, time_slot), group] += f"\n\n{course_details}"
    df = df.unstack(level='Day')
    df = df.reindex(time_slots, level='Time')
    df = df.swaplevel(axis=1).sort_index(axis=1, level='Day')
    return df

def save_schedule_as_image(df, image_path='schedule.png'):
    if not isinstance(df, pd.DataFrame) or not isinstance(df.columns, pd.MultiIndex):
        raise ValueError("df must be a DataFrame with MultiIndex columns.")
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    fig_height = 6 * len(days)
    fig_width = 20
    fig, axs = plt.subplots(len(days), 1, figsize=(fig_width, fig_height))
    if len(days) == 1:
        axs = [axs]
    for ax, day in zip(axs, days):
        day_schedule = df.xs(day, level='Day', axis=1)
        ax.axis('off')
        ax.set_title(day, fontweight='bold', size=6)
        table = ax.table(cellText=day_schedule.values, colLabels=day_schedule.columns, rowLabels=day_schedule.index, loc='center', cellLoc='center')
        table.auto_set_font_size(False)
        table.set_fontsize(5)
        table.scale(1, 2)
        for key, cell in table.get_celld().items():
            if key[0] == 0:
                cell.set_facecolor('black')
                cell.set_text_props(color='white', weight='bold')
            if key[1] == -1:
                cell.set_facecolor('grey')
                cell.set_text_props(color='white', weight='bold')
    plt.tight_layout()
    plt.savefig(image_path, bbox_inches='tight', dpi=300)
    plt.close(fig)

def save_schedule_as_image(df, image_path='schedule.png'):
    if not isinstance(df, pd.DataFrame) or not isinstance(df.columns, pd.MultiIndex):
        raise ValueError("df must be a DataFrame with MultiIndex columns.")
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    fig_height = 6 * len(days) 
    fig_width = 20 
    fig, axs = plt.subplots(len(days), 1, figsize=(fig_width, fig_height))
    if len(days) == 1:
        axs = [axs]
    for ax, day in zip(axs, days):
        day_schedule = df.xs(day, level='Day', axis=1)
        ax.axis('off')
        ax.set_title(day, fontweight='bold', size=6)
        table = ax.table(cellText=day_schedule.values, colLabels=day_schedule.columns, rowLabels=day_schedule.index, loc='center', cellLoc='center')
        table.auto_set_font_size(False)
        table.set_fontsize(5)  
        table.scale(1, 2) 
        for key, cell in table.get_celld().items():
            if key[0] == 0:
                cell.set_facecolor('black')
                cell.set_text_props(color='white', weight='bold')
            if key[1] == -1:
                cell.set_facecolor('grey')
                cell.set_text_props(color='white', weight='bold')
    plt.tight_layout()
    plt.savefig(image_path, bbox_inches='tight', dpi=300)
    plt.close(fig)


def save_daily_schedule_as_image(df, base_image_path='schedule'):
    if not isinstance(df, pd.DataFrame) or not isinstance(df.columns, pd.MultiIndex):
        raise ValueError("df must be a DataFrame with MultiIndex columns.")
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    for day in days:
        day_schedule = df.xs(day, level='Day', axis=1)
        fig, ax = plt.subplots(figsize=(20, 6))
        ax.axis('off')
        ax.set_title(day, fontweight='bold', size=6)
        table = ax.table(cellText=day_schedule.values, colLabels=day_schedule.columns, rowLabels=day_schedule.index, loc='center', cellLoc='center')
        table.auto_set_font_size(False)
        table.set_fontsize(5)
        table.scale(1, 2)
        for key, cell in table.get_celld().items():
            if key[0] == 0:
                cell.set_facecolor('black')
                cell.set_text_props(color='white', weight='bold')
            if key[1] == -1:
                cell.set_facecolor('grey')
                cell.set_text_props(color='white', weight='bold')
        plt.tight_layout()
        plt.savefig(f"{base_image_path}{day.lower()}.png", bbox_inches='tight', dpi=300)
        plt.close(fig)